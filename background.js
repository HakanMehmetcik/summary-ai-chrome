chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        handleSummarization(request.tabId, request.url)
            .then(summary => sendResponse({ success: true, summary: summary }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        
        return true; 
    }
});

async function handleSummarization(tabId, url) {
    const settings = await chrome.storage.sync.get({
        apiUrl: 'http://localhost:11434/api/generate', 
        modelName: 'gpt-oss:20b' 
    });

    const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
    });
    
    const articleText = injectionResults[0].result;

    if (!articleText) {
        throw new Error("Could not extract any meaningful text from the page.");
    }

    // 1. System Prompt: Strictly enforces the persona and prevents chatting
    const systemPrompt = `You are a strict, non-conversational analytical engine. 
    ABSOLUTE RULES:
    1. DO NOT output conversational filler (e.g., "Here is the summary", "Thank you").
    2. YOU MUST format your entire response using the exact Markdown template provided by the user.
    3. Even if the text is short, you MUST extract enough context to fill out all sections of the template.`;

    // 2. User Prompt: Contains the exact template and the text
    const userPrompt = `Analyze and summarize the text below. You MUST output strictly in the following Markdown format:

**Title:** [Exact Title of the Page or Subject]

**Executive Summary:** [Write 2-4 sentences explaining the full scope and context of the text.]

**Key Details & Takeaways:**
• [Extract a detailed bullet point]
• [Extract a detailed bullet point]
• [Extract a detailed bullet point]

**Crucial Logistics & Entities:**
[Provide a comma-separated list of vital entities, key people, dates, or terms mentioned]

Text to summarize:
${articleText}`;

    // 3. Send the structured payload
    const response = await fetch(settings.apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: settings.modelName,
            system: systemPrompt, 
            prompt: userPrompt,   
            stream: false,
            options: {
                temperature: 0.1  
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama server returned status: ${response.status}. Check CORS and Tailscale connection.`);
    }

    const data = await response.json();
    return data.response;
}