/**
 * ai-assistant.js - Logic for SortBot Groq AI Integration
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

class SortBot {
    constructor() {
        this.isOpen = false;
        this.isSettingsOpen = false;
        this.history = JSON.parse(localStorage.getItem('sortbot_history')) || [
            { role: 'assistant', content: "Hi! I'm SortBot, your personal sorting algorithm expert. I'm now powered by Groq for lightning-fast answers! How can I help you?" }
        ];
        this.apiKey = localStorage.getItem('sortbot_groq_key') || "";
        
        this.init();
    }

    init() {
        this.renderUI();
        this.setupEventListeners();
        this.renderMessages();
    }

    renderUI() {
        const assistantHTML = `
            <div class="ai-bubble" id="ai-bubble">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="ai-chat-window" id="ai-chat-window">
                <div class="chat-header">
                    <h3>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path><path d="M12 12L2.8 2.2"></path><path d="M12 12L21.2 2.2"></path></svg>
                        SortBot (Groq)
                    </h3>
                    <div class="header-actions">
                        <button class="chat-settings" id="chat-settings-btn" title="API Settings">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                        <button class="chat-close" id="chat-close-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="typing-indicator" id="typing-indicator">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask about algorithms...">
                    <button id="chat-send">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
                <div class="chat-settings-view" id="chat-settings-view">
                    <h4 style="color: var(--primary-orange); margin-top: 0;">Groq Settings</h4>
                    <p style="color: #888; font-size: 0.85rem;">Enter your <b>Groq API Key</b>. Get one for free at <a href="https://console.groq.com/keys" target="_blank" style="color: var(--primary-orange);">console.groq.com</a>.</p>
                    <input type="password" id="api-key-input" placeholder="Paste Groq Key here..." value="${this.apiKey}">
                    <div style="display: flex; gap: 10px; margin-top: auto;">
                        <button id="save-settings" style="flex: 1; padding: 12px; background: var(--primary-orange); border: none; border-radius: 8px; color: #fff; cursor: pointer;">Save</button>
                        <button id="close-settings" style="flex: 1; padding: 12px; background: #333; border: none; border-radius: 8px; color: #fff; cursor: pointer;">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', assistantHTML);
    }

    setupEventListeners() {
        const bubble = document.getElementById('ai-bubble');
        const closeBtn = document.getElementById('chat-close-btn');
        const settingsBtn = document.getElementById('chat-settings-btn');
        const sendBtn = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');
        const saveSettings = document.getElementById('save-settings');
        const closeSettings = document.getElementById('close-settings');

        bubble.onclick = () => this.toggleChat();
        closeBtn.onclick = () => this.toggleChat();
        settingsBtn.onclick = () => this.toggleSettings();
        closeSettings.onclick = () => this.toggleSettings();
        
        sendBtn.onclick = () => this.sendMessage();
        input.onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };

        saveSettings.onclick = () => {
            const key = document.getElementById('api-key-input').value.trim();
            this.apiKey = key;
            localStorage.setItem('sortbot_groq_key', key);
            this.toggleSettings();
            this.addMessage('assistant', "Groq Key saved! I'm ready to help.");
        };
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        document.getElementById('ai-chat-window').classList.toggle('open', this.isOpen);
    }

    toggleSettings() {
        this.isSettingsOpen = !this.isSettingsOpen;
        document.getElementById('chat-settings-view').style.display = this.isSettingsOpen ? 'flex' : 'none';
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        this.history.forEach(msg => {
            this.addMessageToUI(msg.role === 'user' ? 'user' : 'ai', msg.content);
        });
        this.scrollToBottom();
    }

    addMessage(role, content) {
        this.history.push({ role, content });
        localStorage.setItem('sortbot_history', JSON.stringify(this.history));
        this.addMessageToUI(role === 'user' ? 'user' : 'ai', content);
        this.scrollToBottom();
    }

    addMessageToUI(type, text) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.classList.add('message', type);
        div.textContent = text;
        container.appendChild(div);
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this.addMessage('user', text);

        if (!this.apiKey) {
            this.addMessage('assistant', "Please set your Groq API key in the settings first!");
            return;
        }

        this.showTyping(true);
        try {
            const response = await this.callGroqAPI(text);
            this.showTyping(false);
            this.addMessage('assistant', response);
        } catch (error) {
            console.error("Groq Connection Error:", error);
            this.showTyping(false);
            
            let msg = `Connection Error (${error.message})`;
            if (error.message.includes("401")) msg = "Invalid API Key. Please check your Groq settings.";
            this.addMessage('assistant', msg);
        }
    }

    showTyping(show) {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.style.display = show ? 'flex' : 'none';
        this.scrollToBottom();
    }

    scrollToBottom() {
        const container = document.getElementById('chat-messages');
        if (container) container.scrollTop = container.scrollHeight;
    }

    async callGroqAPI(prompt) {
        const messages = this.history.slice(-5).map(m => ({
            role: m.role,
            content: m.content
        }));

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are SortBot, a concise expert on sorting algorithms. Use Markdown if needed." },
                    ...messages,
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.sortBot = new SortBot();
});
