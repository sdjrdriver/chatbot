// Simple markdown parser
function parseMarkdown(text) {
    // Escape HTML first
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Headers
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Blockquotes
    text = text.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Lists
    text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');
    text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
    text = text.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    
    // Wrap consecutive list items
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

function formatTimestamp(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showCopyFeedback() {
    const feedback = document.getElementById('copyFeedback');
    feedback.classList.add('show');
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}

function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class OllamaChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.branchBtn = document.getElementById('branchBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.ollamaUrl = document.getElementById('ollamaUrl');
        this.modelSelector = document.getElementById('modelSelector');
        this.status = document.getElementById('status');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.exportHistoryBtn = document.getElementById('exportHistoryBtn');
        this.systemPromptBtn = document.getElementById('systemPromptBtn');
        this.advancedBtn = document.getElementById('advancedBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.systemPromptContainer = document.getElementById('systemPromptContainer');
        this.advancedControls = document.getElementById('advancedControls');
        this.searchContainer = document.getElementById('searchContainer');
        this.systemPrompt = document.getElementById('systemPrompt');
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.sessionTabs = document.getElementById('sessionTabs');
        this.addSessionBtn = document.getElementById('addSessionBtn');

        // Advanced controls
        this.temperatureSlider = document.getElementById('temperatureSlider');
        this.maxTokensSlider = document.getElementById('maxTokensSlider');
        this.topPSlider = document.getElementById('topPSlider');
        this.temperatureValue = document.getElementById('temperatureValue');
        this.maxTokensValue = document.getElementById('maxTokensValue');
        this.topPValue = document.getElementById('topPValue');
        
        // Session management
        this.sessions = {};
        this.currentSessionId = '0';
        this.lastUserMessage = '';
        
        this.systemPrompts = {
            helpful: "You are a helpful, friendly, and knowledgeable assistant. Provide clear, accurate, and useful responses.",
            coding: "You are an expert software developer and coding assistant. Provide clean, efficient code examples with clear explanations. Focus on best practices and debugging help.",
            creative: "You are a creative writing assistant. Help with storytelling, creative ideas, and engaging content. Be imaginative and inspiring.",
            technical: "You are a technical analyst and system administrator. Provide detailed technical explanations, troubleshooting steps, and system optimization advice."
        };
        
        this.initEventListeners();
        this.initTheme();
        this.initSessions();
        this.loadSystemPrompt();
        this.loadAdvancedSettings();
        this.loadAvailableModels();
        this.setWelcomeTimestamp();
    }

    initSessions() {
        // Initialize with first session
        this.sessions['0'] = {
            id: '0',
            name: 'Chat 1',
            history: [],
            isActive: true
        };
        
        // Load sessions from localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatbot-sessions') || '{}');
        if (Object.keys(savedSessions).length > 0) {
            this.sessions = savedSessions;
            // Find active session or default to first
            const activeSession = Object.values(this.sessions).find(s => s.isActive) || Object.values(this.sessions)[0];
            this.currentSessionId = activeSession.id;
        }
        
        this.renderSessionTabs();
        this.loadCurrentSession();
    }

    renderSessionTabs() {
        const tabsContainer = this.sessionTabs;
        tabsContainer.innerHTML = '';

        Object.values(this.sessions).forEach(session => {
            const tab = document.createElement('button');
            tab.className = `session-tab ${session.id === this.currentSessionId ? 'active' : ''}`;
            tab.dataset.session = session.id;
            
            tab.innerHTML = `
                <span class="session-tab-name">${session.name}</span>
                <button class="session-tab-close" onclick="event.stopPropagation(); chatbot.closeSession('${session.id}')">×</button>
            `;
            
            tab.addEventListener('click', () => this.switchSession(session.id));
            
            // Double-click to rename
            tab.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.renameSession(session.id);
            });
            
            tabsContainer.appendChild(tab);
        });

        // Add new session button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-session-btn';
        addBtn.innerHTML = '+';
        addBtn.addEventListener('click', () => this.createNewSession());
        tabsContainer.appendChild(addBtn);
    }

    createNewSession() {
        const sessionId = generateSessionId();
        const sessionCount = Object.keys(this.sessions).length;
        
        this.sessions[sessionId] = {
            id: sessionId,
            name: `Chat ${sessionCount + 1}`,
            history: [],
            isActive: false
        };
        
        this.switchSession(sessionId);
        this.saveSessions();
    }

    closeSession(sessionId) {
        if (Object.keys(this.sessions).length <= 1) {
            alert('Cannot close the last session');
            return;
        }
        
        delete this.sessions[sessionId];
        
        if (this.currentSessionId === sessionId) {
            // Switch to first available session
            this.currentSessionId = Object.keys(this.sessions)[0];
            this.sessions[this.currentSessionId].isActive = true;
            this.loadCurrentSession();
        }
        
        this.renderSessionTabs();
        this.saveSessions();
    }

    switchSession(sessionId) {
        // Save current session state
        this.saveCurrentSession();
        
        // Update active states
        Object.values(this.sessions).forEach(s => s.isActive = false);
        this.sessions[sessionId].isActive = true;
        this.currentSessionId = sessionId;
        
        // Load new session
        this.loadCurrentSession();
        this.renderSessionTabs();
        this.saveSessions();
    }

    renameSession(sessionId) {
        const session = this.sessions[sessionId];
        const newName = prompt('Enter new session name:', session.name);
        if (newName && newName.trim()) {
            session.name = newName.trim();
            this.renderSessionTabs();
            this.saveSessions();
        }
    }

    saveCurrentSession() {
        if (this.sessions[this.currentSessionId]) {
            this.sessions[this.currentSessionId].history = this.getCurrentChatHistory();
        }
    }

    loadCurrentSession() {
        const session = this.sessions[this.currentSessionId];
        if (!session) return;
        
        // Clear current messages
        this.chatMessages.innerHTML = '';
        
        if (session.history.length === 0) {
            // Add welcome message for new sessions
            this.addMessage("Hello! I'm your Ollama chatbot. How can I help you today?", 'bot', false);
        } else {
            // Restore session history
            session.history.forEach(msg => {
                this.addMessage(msg.content, msg.sender, false, new Date(msg.timestamp));
            });
        }
        
        this.scrollToBottom();
        this.updateRegenerateButton();
    }

    getCurrentChatHistory() {
        const messages = [];
        this.chatMessages.querySelectorAll('.message').forEach(messageEl => {
            const isUser = messageEl.classList.contains('user');
            const contentEl = messageEl.querySelector('.message-content');
            const textContent = contentEl.textContent || contentEl.innerText;
            const lines = textContent.split('\n');
            const content = lines[0]; // Remove timestamp line
            
            messages.push({
                content: content,
                sender: isUser ? 'user' : 'bot',
                timestamp: new Date().toISOString()
            });
        });
        return messages;
    }

    saveSessions() {
        localStorage.setItem('chatbot-sessions', JSON.stringify(this.sessions));
    }

    branchConversation() {
        // Create new session with current history up to last user message
        const currentHistory = this.getCurrentChatHistory();
        const lastUserIndex = currentHistory.map(m => m.sender).lastIndexOf('user');
        
        if (lastUserIndex === -1) return;
        
        const branchedHistory = currentHistory.slice(0, lastUserIndex + 1);
        const sessionId = generateSessionId();
        const sessionCount = Object.keys(this.sessions).length;
        
        this.sessions[sessionId] = {
            id: sessionId,
            name: `Branch ${sessionCount}`,
            history: branchedHistory,
            isActive: false
        };
        
        this.switchSession(sessionId);
        this.saveSessions();
        
        // Regenerate response in new branch
        if (this.lastUserMessage) {
            setTimeout(() => {
                this.generateResponse(this.lastUserMessage);
            }, 100);
        }
    }
    
    initEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.regenerateBtn.addEventListener('click', () => this.regenerateResponse());
        this.branchBtn.addEventListener('click', () => this.branchConversation());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.ollamaUrl.addEventListener('change', () => this.loadAvailableModels());
        this.modelSelector.addEventListener('change', () => this.testConnection());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        this.systemPromptBtn.addEventListener('click', () => this.toggleSystemPrompt());
        this.advancedBtn.addEventListener('click', () => this.toggleAdvancedControls());
        this.searchBtn.addEventListener('click', () => this.toggleSearch());
        this.systemPrompt.addEventListener('input', () => this.saveSystemPrompt());
        this.searchInput.addEventListener('input', () => this.performSearch());
        
        // Advanced controls
        this.temperatureSlider.addEventListener('input', (e) => {
            this.temperatureValue.textContent = e.target.value;
            this.saveAdvancedSettings();
        });
        this.maxTokensSlider.addEventListener('input', (e) => {
            this.maxTokensValue.textContent = e.target.value;
            this.saveAdvancedSettings();
        });
        this.topPSlider.addEventListener('input', (e) => {
            this.topPValue.textContent = e.target.value;
            this.saveAdvancedSettings();
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.setSystemPromptPreset(preset);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k':
                        e.preventDefault();
                        this.clearHistory();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportHistory();
                        break;
                    case '/':
                        e.preventDefault();
                        this.messageInput.focus();
                        break;
                    case 't':
                        e.preventDefault();
                        this.createNewSession();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleSearch();
                        break;
                }
            }
        });
    }

    performSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        const resultsContainer = this.searchResults;
        
        if (!query) {
            resultsContainer.classList.add('hidden');
            this.clearHighlights();
            return;
        }
        
        const messages = this.chatMessages.querySelectorAll('.message');
        const results = [];
        
        messages.forEach((messageEl, index) => {
            const content = messageEl.querySelector('.message-content').textContent.toLowerCase();
            if (content.includes(query)) {
                const isUser = messageEl.classList.contains('user');
                const preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');
                results.push({
                    index,
                    element: messageEl,
                    preview,
                    sender: isUser ? 'You' : 'Bot'
                });
            }
        });
        
        if (results.length > 0) {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result" data-index="${result.index}">
                    <strong>${result.sender}:</strong>
                    <div class="search-result-preview">${result.preview}</div>
                </div>
            `).join('');
            
            resultsContainer.classList.remove('hidden');
            
            // Add click handlers
            resultsContainer.querySelectorAll('.search-result').forEach(resultEl => {
                resultEl.addEventListener('click', () => {
                    const index = parseInt(resultEl.dataset.index);
                    this.scrollToMessage(results[index].element);
                    this.highlightMessage(results[index].element);
                });
            });
        } else {
            resultsContainer.innerHTML = '<div class="search-result">No results found</div>';
            resultsContainer.classList.remove('hidden');
        }
    }

    scrollToMessage(messageEl) {
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    highlightMessage(messageEl) {
        this.clearHighlights();
        messageEl.classList.add('highlighted');
        setTimeout(() => {
            messageEl.classList.remove('highlighted');
        }, 3000);
    }

    clearHighlights() {
        this.chatMessages.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
    }

    toggleSearch() {
        this.searchContainer.classList.toggle('hidden');
        if (!this.searchContainer.classList.contains('hidden')) {
            this.searchInput.focus();
        } else {
            this.clearHighlights();
        }
    }

    toggleAdvancedControls() {
        this.advancedControls.classList.toggle('hidden');
    }

    loadAdvancedSettings() {
        const settings = JSON.parse(localStorage.getItem('chatbot-advanced-settings') || '{}');
        
        this.temperatureSlider.value = settings.temperature || 0.8;
        this.maxTokensSlider.value = settings.maxTokens || 2000;
        this.topPSlider.value = settings.topP || 0.9;
        
        this.temperatureValue.textContent = this.temperatureSlider.value;
        this.maxTokensValue.textContent = this.maxTokensSlider.value;
        this.topPValue.textContent = this.topPSlider.value;
    }

    saveAdvancedSettings() {
        const settings = {
            temperature: parseFloat(this.temperatureSlider.value),
            maxTokens: parseInt(this.maxTokensSlider.value),
            topP: parseFloat(this.topPSlider.value)
        };
        localStorage.setItem('chatbot-advanced-settings', JSON.stringify(settings));
    }

    setWelcomeTimestamp() {
        const welcomeTimestamp = document.getElementById('welcomeTimestamp');
        if (welcomeTimestamp) {
            welcomeTimestamp.textContent = formatTimestamp(new Date());
        }
    }
    
    initTheme() {
        const savedTheme = localStorage.getItem('chatbot-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('chatbot-theme', newTheme);
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeToggle.innerHTML = '☀️ Light';
        } else {
            document.body.classList.remove('dark-mode');
            this.themeToggle.innerHTML = '🌙 Dark';
        }
    }

    async loadAvailableModels() {
        try {
            const response = await fetch(`${this.ollamaUrl.value}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                this.populateModelSelector(data.models);
                this.testConnection();
            } else {
                this.modelSelector.innerHTML = '<option value="">Failed to load models</option>';
            }
        } catch (error) {
            this.modelSelector.innerHTML = '<option value="">Connection error</option>';
        }
    }

    populateModelSelector(models) {
        const savedModel = localStorage.getItem('chatbot-selected-model') || 'llama3.2:3b';
        this.modelSelector.innerHTML = '';
        
        if (models && models.length > 0) {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = `${model.name} (${this.formatFileSize(model.size)})`;
                if (model.name === savedModel) {
                    option.selected = true;
                }
                this.modelSelector.appendChild(option);
            });
        } else {
            this.modelSelector.innerHTML = '<option value="">No models available</option>';
        }

        // Save selection changes
        this.modelSelector.addEventListener('change', () => {
            localStorage.setItem('chatbot-selected-model', this.modelSelector.value);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    clearHistory() {
        if (confirm('Are you sure you want to clear this session\'s chat history?')) {
            this.chatMessages.innerHTML = '';
            // Add welcome message back
            this.addMessage("Hello! I'm your Ollama chatbot. How can I help you today?", 'bot', false);
            this.regenerateBtn.classList.add('hidden');
            this.branchBtn.classList.add('hidden');
            
            // Update session
            this.sessions[this.currentSessionId].history = [];
            this.saveSessions();
        }
    }
    
    exportHistory() {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const sessionName = this.sessions[this.currentSessionId].name.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `ollama-chat-${sessionName}-${timestamp}.json`;
        
        const exportData = {
            timestamp: new Date().toISOString(),
            sessionName: this.sessions[this.currentSessionId].name,
            model: this.modelSelector.value,
            systemPrompt: this.systemPrompt.value,
            advancedSettings: {
                temperature: parseFloat(this.temperatureSlider.value),
                maxTokens: parseInt(this.maxTokensSlider.value),
                topP: parseFloat(this.topPSlider.value)
            },
            messages: this.getCurrentChatHistory()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    toggleSystemPrompt() {
        this.systemPromptContainer.classList.toggle('hidden');
    }
    
    loadSystemPrompt() {
        const savedPrompt = localStorage.getItem('chatbot-system-prompt') || '';
        this.systemPrompt.value = savedPrompt;
    }
    
    saveSystemPrompt() {
        localStorage.setItem('chatbot-system-prompt', this.systemPrompt.value);
    }
    
    setSystemPromptPreset(preset) {
        if (preset === 'clear') {
            this.systemPrompt.value = '';
        } else {
            this.systemPrompt.value = this.systemPrompts[preset] || '';
        }
        this.saveSystemPrompt();
    }
    
    async testConnection() {
        const selectedModel = this.modelSelector.value;
        if (!selectedModel) {
            this.updateStatus('No model selected', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.ollamaUrl.value}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                const modelExists = data.models.some(m => m.name === selectedModel);
                
                if (modelExists) {
                    this.updateStatus('Connected ✅', 'connected');
                } else {
                    this.updateStatus(`Model '${selectedModel}' not found`, 'error');
                }
            } else {
                this.updateStatus('Connection failed', 'error');
            }
        } catch (error) {
            this.updateStatus('Connection error', 'error');
        }
    }
    
    updateStatus(text, type) {
        this.status.textContent = text;
        this.status.className = `status ${type}`;
    }

    updateRegenerateButton() {
        const messages = this.chatMessages.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage && lastMessage.classList.contains('bot')) {
            this.regenerateBtn.classList.remove('hidden');
            this.branchBtn.classList.remove('hidden');
        } else {
            this.regenerateBtn.classList.add('hidden');
            this.branchBtn.classList.add('hidden');
        }
    }

    async regenerateResponse() {
        if (!this.lastUserMessage) return;
        
        // Remove the last bot response from UI
        const messages = this.chatMessages.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.classList.contains('bot')) {
            lastMessage.remove();
        }
        
        // Resend the last user message
        await this.generateResponse(this.lastUserMessage);
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.lastUserMessage = message;
        
        // Disable input
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        this.regenerateBtn.disabled = true;
        this.branchBtn.disabled = true;
        
        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        await this.generateResponse(message);
    }

    async generateResponse(message) {
        // Show typing indicator
        this.showTyping();
        
        try {
            // Prepare the prompt with system prompt if set
            let fullPrompt = message;
            const systemPromptText = this.systemPrompt.value.trim();
            if (systemPromptText) {
                fullPrompt = `${systemPromptText}\n\nUser: ${message}`;
            }

            // Get advanced settings
            const advancedSettings = {
                temperature: parseFloat(this.temperatureSlider.value),
                num_predict: parseInt(this.maxTokensSlider.value),
                top_p: parseFloat(this.topPSlider.value)
            };
            
            const response = await fetch(`${this.ollamaUrl.value}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelSelector.value,
                    prompt: fullPrompt,
                    stream: false,
                    options: advancedSettings
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.hideTyping();
            this.addMessage(data.response, 'bot');
            
            // Show control buttons
            this.updateRegenerateButton();
            
        } catch (error) {
            this.hideTyping();
            this.addMessage(`Error: ${error.message}. Please check your Ollama connection and model selection.`, 'bot');
            console.error('Error:', error);
        } finally {
            // Re-enable input
            this.messageInput.disabled = false;
            this.sendButton.disabled = false;
            this.regenerateBtn.disabled = false;
            this.branchBtn.disabled = false;
            this.messageInput.focus();
            
            // Save session
            this.saveCurrentSession();
            this.saveSessions();
        }
    }

    copyMessage(content) {
        navigator.clipboard.writeText(content).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
    
    addMessage(content, sender, saveToHistory = true, timestamp = new Date()) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Parse markdown for bot messages
        if (sender === 'bot') {
            messageContent.innerHTML = parseMarkdown(content);
        } else {
            messageContent.textContent = content;
        }

        // Add timestamp
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = formatTimestamp(timestamp);
        messageContent.appendChild(timestampDiv);

        // Add message actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Copy message';
        copyBtn.onclick = () => this.copyMessage(content);
        
        actionsDiv.appendChild(copyBtn);
        messageContent.appendChild(actionsDiv);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTyping() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Global reference for session management
let chatbot;

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new OllamaChatbot();
});