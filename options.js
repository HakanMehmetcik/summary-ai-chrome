document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(
        {
            apiUrl: 'http://localhost:11434/api/generate',
            modelName: 'gpt-oss:20b'
        },
        (items) => {
            document.getElementById('apiUrl').value = items.apiUrl;
            document.getElementById('modelName').value = items.modelName;
        }
    );
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const apiUrl = document.getElementById('apiUrl').value;
    const modelName = document.getElementById('modelName').value;

    chrome.storage.sync.set(
        {
            apiUrl: apiUrl,
            modelName: modelName
        },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Settings saved successfully!';
            setTimeout(() => {
                status.textContent = '';
            }, 3000);
        }
    );
});