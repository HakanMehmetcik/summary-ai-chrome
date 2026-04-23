document.addEventListener('DOMContentLoaded', async () => {
    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');
    const errorState = document.getElementById('errorState');
    const summaryContent = document.getElementById('summaryContent');
    const copyBtn = document.getElementById('copyBtn');

    let currentUrl = '';
    let finalSummary = ''; 

    // Lightweight parser to handle bolding and formatting
    const renderMarkdown = (text) => {
        return text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^• (.*$)/gim, '<li style="margin-left: 20px;">$1</li>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/(?!>)\n(?!<)/g, '<br>'); // Replace newlines with breaks if not next to tags
    };

    // Get the current active tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentUrl = tab.url;

    // Trigger background process
    chrome.runtime.sendMessage(
        { action: "summarize", tabId: tab.id, url: currentUrl },
        (response) => {
            loadingState.style.display = 'none';

            if (chrome.runtime.lastError || !response || !response.success) {
                errorState.textContent = response?.error || "An unknown error occurred.";
                errorState.style.display = 'block';
                return;
            }

            finalSummary = response.summary;
            
            // Show formatted HTML in the extension popup
            summaryContent.innerHTML = renderMarkdown(finalSummary);
            
            successState.style.display = 'flex';
            successState.style.flexDirection = 'column';
            successState.style.gap = '10px';
        }
    );

    // Upgraded Rich Text Copy Handler
    copyBtn.addEventListener('click', async () => {
        // 1. Plain Text Fallback (Markdown)
        const plainTextPayload = `🔗 ${currentUrl}\n\n${finalSummary}`;
        
        // 2. Rich Text HTML (For Word, Email, etc.)
        const htmlPayload = `<div style="font-family: sans-serif; line-height: 1.5;">
            <p><a href="${currentUrl}">🔗 Original Article</a></p>
            ${renderMarkdown(finalSummary)}
        </div>`;
        
        try {
            // Write BOTH formats to the clipboard natively
            const clipboardItem = new ClipboardItem({
                "text/plain": new Blob([plainTextPayload], { type: "text/plain" }),
                "text/html": new Blob([htmlPayload], { type: "text/html" })
            });
            
            await navigator.clipboard.write([clipboardItem]);
            
            // Visual feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied Formatted Text!';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy text: ', err);
            errorState.textContent = 'Clipboard permission denied or failed.';
            errorState.style.display = 'block';
        }
    });
});