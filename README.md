# Local Context Share 🧠

A privacy-first Chrome Extension that uses your own locally hosted Large Language Models (via [Ollama](https://ollama.com/)) to extract, analyze, and summarize web pages. 

Because the extension communicates exclusively with your designated local or private network endpoint (like Tailscale), **zero data is sent to the cloud**. Your browsing history and the content you summarize remain 100% private.

## ✨ Features
* **Absolute Privacy:** Summarize sensitive articles, internal docs, or financial news without sending data to OpenAI, Anthropic, or Google.
* **Zero Recurring Costs:** Run powerful open-source models (like Llama 3, Command-R, or Mixtral) on your own hardware.
* **Smart Extraction:** Strips out ads, navigation bars, and footers before sending the text to the model to save context space.
* **Expert Analytical Summaries:** Uses a strict system prompt to generate high-value, structured outputs (Executive Summary, Key Takeaways, Crucial Logistics) instead of generic "chatty" responses.
* **Rich Text Copying:** Copies beautifully formatted HTML (bolding, bullet points, headers) straight to your clipboard for seamless pasting into Slack, Notion, Obsidian, or Email.
* **Remote Access Ready:** Easily configure the extension to talk to your home server/rig over a secure Tailscale IP.

---

## 🚀 Installation (Developer Mode)

Currently, this extension is meant to be loaded directly into Chrome/Edge from your local machine.

1. Download or clone this repository to your computer.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** ON (top right corner).
4. Click **Load unpacked** (top left corner).
5. Select the folder containing this extension's files.
6. Pin the extension to your toolbar for easy access!

---

## ⚙️ Configuration & Crucial CORS Setup

For this extension to work, it must be able to communicate with your Ollama instance. By default, Ollama blocks requests from browser extensions due to Cross-Origin Resource Sharing (CORS) security.

### 1. Enable CORS in Ollama
You must start your Ollama server with the `OLLAMA_ORIGINS` environment variable set to allow external requests.

**Mac/Linux Terminal:**
```bash
OLLAMA_ORIGINS="*" ollama serve
```

*(If you are running Ollama as a background service/app, you will need to add `OLLAMA_ORIGINS="*"` to your environment variables or service configuration file).*

### 2. Configure the Extension
1. Right-click the Local Context Share icon in your Chrome toolbar and select **Options**.
2. **API Endpoint:** Enter your Ollama generation URL. 
   * *If running on the same machine:* `http://localhost:11434/api/generate`
   * *If running on a remote rig via Tailscale:* `http://[YOUR-TAILSCALE-IP]:11434/api/generate`
3. **Model Name:** Enter the exact name of the model you have pulled in Ollama (e.g., `llama3:8b`, `gpt-oss:20b`).
4. Click **Save**.

---

## 💡 Usage

1. Navigate to any text-heavy article, blog post, or documentation page.
2. Click the extension icon in your toolbar.
3. Wait a few seconds for your local LLM to process the text.
4. Click **Copy & Share** to copy the formatted summary and the original URL to your clipboard. 
5. Paste directly into your notes or messaging apps!

---

## 🛡️ Privacy Policy & Security

**This extension does not collect, store, or transmit any user data to third-party servers or the developer.** The only network requests made by this extension are direct HTTP `POST` requests sent from your browser to the exact IP address and port you specify in the Options menu. If you point the extension to `localhost`, your data never leaves your physical machine. 

To function, the extension requires broad host permissions (`http://*/*` and `https://*/*`) purely so it can inject the text-extraction script into the active tab and communicate with your dynamic, custom-defined API endpoint. 

---

## 🛠️ Built With
* Manifest V3
* Vanilla JavaScript, HTML, CSS
* [Ollama](https://ollama.com/) (Backend compatibility)

## 🤝 Contributing
Feel free to open issues or submit pull requests! If you have ideas for better system prompts or improved text extraction for difficult websites, contributions are welcome.