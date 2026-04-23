// content.js

function extractMainText() {
    // Select elements most likely to contain the actual article content
    const textElements = document.querySelectorAll('p, h1, h2, h3, article, section, li');
    let extractedText = [];
    
    textElements.forEach(el => {
        const text = el.innerText.trim();
        // Filter out tiny, empty UI elements or raw code
        if (text.length > 25) { 
            extractedText.push(text);
        }
    });
    
    // Join the text and apply a hard limit to prevent blowing up the context window
    const combinedText = extractedText.join('\n\n');
    return combinedText.substring(0, 25000); 
}

// Return the extracted text back to the background script
extractMainText();