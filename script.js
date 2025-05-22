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

// File handling utilities
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function isTextFile(filename) {
    const textExtensions = ['txt', 'md', 'json', 'csv', 'xml', 'log'];
    return textExtensions.includes(getFileExtension(filename));
}

// Conversation intelligence utilities
function extractTopics(text) {
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);
}

function calculateReadingTime(text) {
    const words = text.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
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
        this.fileBtn = document.getElementById('fileBtn');
        this.analyticsBtn = document.getElementById('analyticsBtn');
        this.templatesBtn = document.getElementById('templatesBtn');
        this.systemPromptContainer = document.getElementById('systemPromptContainer');
        this.advancedControls = document.getElementById('advancedControls');
        this.searchContainer = document.getElementById('searchContainer');
        this.fileContainer = document.getElementById('fileContainer');
        this.analyticsContainer = document.getElementById('analyticsContainer');
        this.templatesContainer = document.getElementById('templatesContainer');
        this.systemPrompt = document.getElementById('systemPrompt');
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.sessionTabs = document.getElementById('sessionTabs');
        this.addSessionBtn = document.getElementById('addSessionBtn');
        this.fileInput = document.getElementById('fileInput');
        this.fileList = document.getElementById('fileList');

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
        this.uploadedFiles = {};
        this.conversationAnalytics = {};
        
        // Conversation templates
        this.conversationTemplates = {
            brainstorm: {
                name: "Brainstorming Session",
                prompt: "Let's brainstorm ideas about: ",
                systemPrompt: "You are a creative brainstorming partner. Help generate innovative ideas and build upon suggestions."
            },
            interview: {
                name: "Interview Practice",
                prompt: "I'd like to practice for an interview for: ",
                systemPrompt: "You are an experienced interviewer. Ask relevant questions and provide constructive feedback."
            },
            debug: {
                name: "Code Debugging",
                prompt: "I need help debugging this code: ",
                systemPrompt: "You are an expert debugger. Analyze code, identify issues, and suggest fixes with clear explanations."
            },
            learning: {
                name: "Learning Assistant",
                prompt: "I want to learn about: ",
                systemPrompt: "You are a patient teacher. Break down complex topics into understandable parts with examples."
            },
            writing: {
                name: "Writing Helper",
                prompt: "I need help with writing: ",
                systemPrompt: "You are a professional writing assistant. Help improve clarity, structure, and style."
            }
        };
        
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
        this.initFileHandling();
        this.updateAnalytics();
    }

    initFileHandling() {
        // Initialize file input if it exists
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
    }

    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        const sessionFiles = this.uploadedFiles[this.currentSessionId] || [];
        
        for (const file of files) {
            try {
                const fileData = {
                    id: generateSessionId(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    uploadDate: new Date().toISOString(),
                    content: null
                };
                
                // Read file content
                if (isTextFile(file.name) || file.type.startsWith('text/')) {
                    fileData.content = await this.readFileAsText(file);
                } else {
                    fileData.content = await this.readFileAsBase64(file);
                }
                
                sessionFiles.push(fileData);
                this.uploadedFiles[this.currentSessionId] = sessionFiles;
                
                // Show success message
                this.addMessage(`📁 File uploaded successfully: ${file.name} (${formatFileSize(file.size)})`, 'system');
                
            } catch (error) {
                this.addMessage(`❌ Error uploading file ${file.name}: ${error.message}`, 'system');
            }
        }
        
        this.updateFileList();
        this.saveUploadedFiles();
        event.target.value = ''; // Clear input
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    updateFileList() {
        if (!this.fileList) return;
        
        const sessionFiles = this.uploadedFiles[this.currentSessionId] || [];
        
        if (sessionFiles.length === 0) {
            this.fileList.innerHTML = '<div class="no-files">No files uploaded</div>';
            return;
        }
        
        this.fileList.innerHTML = sessionFiles.map(file => `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="chatbot.useFileInContext('${file.id}')" title="Use in context">🔗</button>
                    <button class="file-action-btn" onclick="chatbot.removeFile('${file.id}')" title="Remove">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    useFileInContext(fileId) {
        const sessionFiles = this.uploadedFiles[this.currentSessionId] || [];
        const file = sessionFiles.find(f => f.id === fileId);
        
        if (!file) return;
        
        if (isTextFile(file.name) && file.content) {
            const contextMessage = `📎 Using file context from "${file.name}":\n\n${file.content.substring(0, 1000)}${file.content.length > 1000 ? '...' : ''}`;
            this.messageInput.value = contextMessage + '\n\n' + this.messageInput.value;
            this.messageInput.focus();
        } else {
            this.addMessage(`📎 File "${file.name}" is now available as context for your next question.`, 'system');
        }
    }

    removeFile(fileId) {
        const sessionFiles = this.uploadedFiles[this.currentSessionId] || [];
        this.uploadedFiles[this.currentSessionId] = sessionFiles.filter(f => f.id !== fileId);
        this.updateFileList();
        this.saveUploadedFiles();
        this.addMessage(`🗑️ File removed from session.`, 'system');
    }

    saveUploadedFiles() {
        localStorage.setItem('chatbot-uploaded-files', JSON.stringify(this.uploadedFiles));
    }

    loadUploadedFiles() {
        const saved = localStorage.getItem('chatbot-uploaded-files');
        if (saved) {
            this.uploadedFiles = JSON.parse(saved);
        }
    }

    // Conversation Analytics
    updateAnalytics() {
        const session = this.sessions[this.currentSessionId];
        if (!session) return;
        
        const messages = session.history || [];
        const userMessages = messages.filter(m => m.sender === 'user');
        const botMessages = messages.filter(m => m.sender === 'bot');
        
        const analytics = {
            totalMessages: messages.length,
            userMessages: userMessages.length,
            botMessages: botMessages.length,
            totalWords: messages.reduce((acc, m) => acc + (m.content ? m.content.split(' ').length : 0), 0),
            estimatedTokens: messages.reduce((acc, m) => acc + Math.ceil((m.content?.length || 0) / 4), 0),
            readingTime: calculateReadingTime(messages.map(m => m.content || '').join(' ')),
            topics: extractTopics(messages.map(m => m.content || '').join(' ')),
            sessionDuration: this.calculateSessionDuration(messages)
        };
        
        this.conversationAnalytics[this.currentSessionId] = analytics;
        this.renderAnalytics(analytics);
    }

    calculateSessionDuration(messages) {
        if (messages.length < 2) return 0;
        const first = new Date(messages[0].timestamp);
        const last = new Date(messages[messages.length - 1].timestamp);
        return Math.round((last - first) / (1000 * 60)); // minutes
    }

    renderAnalytics(analytics) {
        const container = document.getElementById('analyticsContent');
        if (!container) return;
        
        container.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h4>Messages</h4>
                    <div class="analytics-value">${analytics.totalMessages}</div>
                    <div class="analytics-detail">${analytics.userMessages} from you, ${analytics.botMessages} from AI</div>
                </div>
                <div class="analytics-card">
                    <h4>Words</h4>
                    <div class="analytics-value">${analytics.totalWords.toLocaleString()}</div>
                    <div class="analytics-detail">~${analytics.estimatedTokens.toLocaleString()} tokens</div>
                </div>
                <div class="analytics-card">
                    <h4>Reading Time</h4>
                    <div class="analytics-value">${analytics.readingTime} min</div>
                    <div class="analytics-detail">Session: ${analytics.sessionDuration} min</div>
                </div>
                <div class="analytics-card">
                    <h4>Top Topics</h4>
                    <div class="analytics-topics">${analytics.topics.slice(0, 3).join(', ')}</div>
                </div>
            </div>
            <div class="analytics-actions">
                <button class="analytics-btn" onclick="chatbot.generateSummary()">📋 Generate Summary</button>
                <button class="analytics-btn" onclick="chatbot.exportAnalytics()">📊 Export Analytics</button>
            </div>
        `;
    }

    async generateSummary() {
        const session = this.sessions[this.currentSessionId];
        if (!session || !session.history.length) return;
        
        const messages = session.history.map(m => `${m.sender}: ${m.content}`).join('\n');
        const summaryPrompt = `Please provide a concise summary of this conversation:\n\n${messages.substring(0, 2000)}`;
        
        this.addMessage('🤖 Generating conversation summary...', 'system');
        
        try {
            const response = await fetch(`${this.ollamaUrl.value}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.modelSelector.value,
                    prompt: summaryPrompt,
                    stream: false,
                    options: { temperature: 0.3, num_predict: 200 }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.addMessage(`📋 **Conversation Summary:**\n\n${data.response}`, 'bot');
            } else {
                throw new Error('Failed to generate summary');
            }
        } catch (error) {
            this.addMessage(`❌ Error generating summary: ${error.message}`, 'system');
        }
    }

    exportAnalytics() {
        const analytics = this.conversationAnalytics[this.currentSessionId];
        if (!analytics) return;
        
        const data = {
            sessionName: this.sessions[this.currentSessionId].name,
            timestamp: new Date().toISOString(),
            analytics: analytics,
            model: this.modelSelector.value
        };
        
        this.downloadJSON(data, `analytics-${this.currentSessionId}-${Date.now()}.json`);
    }

    // Conversation Templates
    renderTemplates() {
        const container = document.getElementById('templatesContent');
        if (!container) return;
        
        container.innerHTML = `
            <div class="templates-grid">
                ${Object.entries(this.conversationTemplates).map(([key, template]) => `
                    <div class="template-card" onclick="chatbot.useTemplate('${key}')">
                        <h4>${template.name}</h4>
                        <p>${template.prompt}</p>
                    </div>
                `).join('')}
            </div>
            <div class="template-actions">
                <button class="template-btn" onclick="chatbot.createCustomTemplate()">➕ Create Custom Template</button>
            </div>
        `;
    }

    useTemplate(templateKey) {
        const template = this.conversationTemplates[templateKey];
        if (!template) return;
        
        // Set system prompt
        this.systemPrompt.value = template.systemPrompt;
        this.saveSystemPrompt();
        
        // Set message input
        this.messageInput.value = template.prompt;
        this.messageInput.focus();
        
        // Hide templates
        if (this.templatesContainer) {
            this.templatesContainer.classList.add('hidden');
        }
        
        this.addMessage(`📝 Template "${template.name}" loaded. Complete the prompt and send your message.`, 'system');
    }

    createCustomTemplate() {
        const name = prompt('Enter template name:');
        if (!name) return;
        
        const prompt = prompt('Enter template prompt:');
        if (!prompt) return;
        
        const systemPrompt = prompt('Enter system prompt (optional):') || '';
        
        const key = name.toLowerCase().replace(/\s+/g, '_');
        this.conversationTemplates[key] = {
            name: name,
            prompt: prompt,
            systemPrompt: systemPrompt
        };
        
        this.saveCustomTemplates();
        this.renderTemplates();
        this.addMessage(`✅ Custom template "${name}" created successfully.`, 'system');
    }

    saveCustomTemplates() {
        const customTemplates = {};
        Object.entries(this.conversationTemplates).forEach(([key, template]) => {
            if (!['brainstorm', 'interview', 'debug', 'learning', 'writing'].includes(key)) {
                customTemplates[key] = template;
            }
        });
        localStorage.setItem('chatbot-custom-templates', JSON.stringify(customTemplates));
    }

    loadCustomTemplates() {
        const saved = localStorage.getItem('chatbot-custom-templates');
        if (saved) {
            const customTemplates = JSON.parse(saved);
            this.conversationTemplates = { ...this.conversationTemplates, ...customTemplates };
        }
    }

    // Enhanced Export System
    async exportEnhanced(format = 'json') {
        const session = this.sessions[this.currentSessionId];
        const analytics = this.conversationAnalytics[this.currentSessionId];
        const files = this.uploadedFiles[this.currentSessionId] || [];
        
        const exportData = {
            version: '1.5.0',
            timestamp: new Date().toISOString(),
            session: {
                id: session.id,
                name: session.name,
                model: this.modelSelector.value,
                systemPrompt: this.systemPrompt.value,
                advancedSettings: {
                    temperature: parseFloat(this.temperatureSlider.value),
                    maxTokens: parseInt(this.maxTokensSlider.value),
                    topP: parseFloat(this.topPSlider.value)
                }
            },
            messages: session.history || [],
            analytics: analytics,
            files: files.map(f => ({ name: f.name, size: f.size, type: f.type, uploadDate: f.uploadDate })),
            metadata: {
                messageCount: session.history?.length || 0,
                wordCount: analytics?.totalWords || 0,
                exportFormat: format
            }
        };
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const sessionName = session.name.replace(/[^a-zA-Z0-9]/g, '_');
        
        switch (format) {
            case 'json':
                this.downloadJSON(exportData, `ollama-chat-${sessionName}-${timestamp}.json`);
                break;
            case 'markdown':
                this.downloadMarkdown(exportData, `ollama-chat-${sessionName}-${timestamp}.md`);
                break;
            case 'txt':
                this.downloadText(exportData, `ollama-chat-${sessionName}-${timestamp}.txt`);
                break;
            case 'html':
                this.downloadHTML(exportData, `ollama-chat-${sessionName}-${timestamp}.html`);
                break;
        }
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    downloadMarkdown(data, filename) {
        let markdown = `# ${data.session.name}\n\n`;
        markdown += `**Export Date:** ${new Date(data.timestamp).toLocaleString()}\n`;
        markdown += `**Model:** ${data.session.model}\n`;
        if (data.analytics) {
            markdown += `**Messages:** ${data.analytics.totalMessages}\n`;
            markdown += `**Words:** ${data.analytics.totalWords}\n`;
        }
        markdown += '\n---\n\n';
        
        data.messages.forEach(msg => {
            const speaker = msg.sender === 'user' ? '👤 **You**' : '🤖 **Assistant**';
            markdown += `## ${speaker}\n\n${msg.content}\n\n`;
        });
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        this.downloadBlob(blob, filename);
    }

    downloadText(data, filename) {
        let text = `${data.session.name}\n`;
        text += `Export Date: ${new Date(data.timestamp).toLocaleString()}\n`;
        text += `Model: ${data.session.model}\n`;
        text += '\n' + '='.repeat(50) + '\n\n';
        
        data.messages.forEach(msg => {
            const speaker = msg.sender === 'user' ? 'You' : 'Assistant';
            text += `${speaker}: ${msg.content}\n\n`;
        });
        
        const blob = new Blob([text], { type: 'text/plain' });
        this.downloadBlob(blob, filename);
    }

    downloadHTML(data, filename) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.session.name}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
                .message { margin-bottom: 20px; padding: 15px; border-radius: 10px; }
                .user { background: #e3f2fd; margin-left: 20px; }
                .bot { background: #f5f5f5; margin-right: 20px; }
                .speaker { font-weight: bold; margin-bottom: 5px; }
                .timestamp { font-size: 0.8em; color: #666; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${data.session.name}</h1>
                <p><strong>Export Date:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                <p><strong>Model:</strong> ${data.session.model}</p>
                ${data.analytics ? `<p><strong>Messages:</strong> ${data.analytics.totalMessages} | <strong>Words:</strong> ${data.analytics.totalWords}</p>` : ''}
            </div>
            ${data.messages.map(msg => `
                <div class="message ${msg.sender}">
                    <div class="speaker">${msg.sender === 'user' ? '👤 You' : '🤖 Assistant'}</div>
                    <div class="content">${msg.content.replace(/\n/g, '<br>')}</div>
                    ${msg.timestamp ? `<div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>` : ''}
                </div>
            `).join('')}
        </body>
        </html>`;
        
        const blob = new Blob([html], { type: 'text/html' });
        this.downloadBlob(blob, filename);
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
        
        this.loadUploadedFiles();
        this.loadCustomTemplates();
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
        delete this.uploadedFiles[sessionId];
        delete this.conversationAnalytics[sessionId];
        
        if (this.currentSessionId === sessionId) {
            // Switch to first available session
            this.currentSessionId = Object.keys(this.sessions)[0];
            this.sessions[this.currentSessionId].isActive = true;
            this.loadCurrentSession();
        }
        
        this.renderSessionTabs();
        this.saveSessions();
        this.saveUploadedFiles();
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
        this.updateFileList();
        this.updateAnalytics();
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
            const isSystem = messageEl.classList.contains('system');
            const contentEl = messageEl.querySelector('.message-content');
            
            if (isSystem) return; // Skip system messages in history
            
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
        this.exportHistoryBtn.addEventListener('click', () => this.showExportOptions());
        this.systemPromptBtn.addEventListener('click', () => this.toggleSystemPrompt());
        this.advancedBtn.addEventListener('click', () => this.toggleAdvancedControls());
        this.searchBtn.addEventListener('click', () => this.toggleSearch());
        
        // New v1.5.0 event listeners
        if (this.fileBtn) {
            this.fileBtn.addEventListener('click', () => this.toggleFileManager());
        }
        if (this.analyticsBtn) {
            this.analyticsBtn.addEventListener('click', () => this.toggleAnalytics());
        }
        if (this.templatesBtn) {
            this.templatesBtn.addEventListener('click', () => this.toggleTemplates());
        }
        
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
                        this.showExportOptions();
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
                    case 'u':
                        e.preventDefault();
                        if (this.fileInput) this.fileInput.click();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.toggleAnalytics();
                        break;
                }
            }
        });
    }
 
    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="export-modal-content">
                <h3>Export Conversation</h3>
                <div class="export-options">
                    <button class="export-option-btn" onclick="chatbot.exportEnhanced('json')">
                        📄 JSON <small>(Complete data)</small>
                    </button>
                    <button class="export-option-btn" onclick="chatbot.exportEnhanced('markdown')">
                        📝 Markdown <small>(Formatted text)</small>
                    </button>
                    <button class="export-option-btn" onclick="chatbot.exportEnhanced('html')">
                        🌐 HTML <small>(Web page)</small>
                    </button>
                    <button class="export-option-btn" onclick="chatbot.exportEnhanced('txt')">
                        📋 Text <small>(Plain text)</small>
                    </button>
                </div>
                <div class="export-actions">
                    <button class="export-cancel-btn" onclick="this.closest('.export-modal').remove()">Cancel</button>
                    <button class="export-batch-btn" onclick="chatbot.exportAllSessions()">Export All Sessions</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Auto-close after export
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 30000);
    }
 
    async exportAllSessions() {
        const allData = {
            version: '1.5.0',
            exportDate: new Date().toISOString(),
            sessions: [],
            globalAnalytics: {
                totalSessions: Object.keys(this.sessions).length,
                totalMessages: 0,
                totalWords: 0
            }
        };
        
        for (const [sessionId, session] of Object.entries(this.sessions)) {
            const analytics = this.conversationAnalytics[sessionId];
            const files = this.uploadedFiles[sessionId] || [];
            
            allData.sessions.push({
                id: sessionId,
                name: session.name,
                messages: session.history || [],
                analytics: analytics,
                files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
            });
            
            if (analytics) {
                allData.globalAnalytics.totalMessages += analytics.totalMessages || 0;
                allData.globalAnalytics.totalWords += analytics.totalWords || 0;
            }
        }
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        this.downloadJSON(allData, `ollama-chatbot-all-sessions-${timestamp}.json`);
        
        // Close modal
        document.querySelector('.export-modal')?.remove();
    }
 
    toggleFileManager() {
        if (this.fileContainer) {
            this.fileContainer.classList.toggle('hidden');
            if (!this.fileContainer.classList.contains('hidden')) {
                this.updateFileList();
            }
        }
    }
 
    toggleAnalytics() {
        if (this.analyticsContainer) {
            this.analyticsContainer.classList.toggle('hidden');
            if (!this.analyticsContainer.classList.contains('hidden')) {
                this.updateAnalytics();
            }
        }
    }
 
    toggleTemplates() {
        if (this.templatesContainer) {
            this.templatesContainer.classList.toggle('hidden');
            if (!this.templatesContainer.classList.contains('hidden')) {
                this.renderTemplates();
            }
        }
    }
 
    performSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        const resultsContainer = this.searchResults;
        
        if (!query) {
            resultsContainer.classList.add('hidden');
            this.clearHighlights();
            return;
        }
        
        // Search across all sessions
        const allResults = [];
        
        Object.entries(this.sessions).forEach(([sessionId, session]) => {
            const messages = session.history || [];
            messages.forEach((msg, index) => {
                const content = msg.content.toLowerCase();
                if (content.includes(query)) {
                    const preview = msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '');
                    allResults.push({
                        sessionId,
                        sessionName: session.name,
                        messageIndex: index,
                        preview,
                        sender: msg.sender === 'user' ? 'You' : 'Bot',
                        timestamp: msg.timestamp
                    });
                }
            });
        });
        
        if (allResults.length > 0) {
            resultsContainer.innerHTML = allResults.map(result => `
                <div class="search-result" data-session-id="${result.sessionId}" data-message-index="${result.messageIndex}">
                    <div class="search-result-header">
                        <strong>${result.sender}</strong> in <em>${result.sessionName}</em>
                        ${result.timestamp ? `<span class="search-timestamp">${formatTimestamp(new Date(result.timestamp))}</span>` : ''}
                    </div>
                    <div class="search-result-preview">${result.preview}</div>
                </div>
            `).join('');
            
            resultsContainer.classList.remove('hidden');
            
            // Add click handlers
            resultsContainer.querySelectorAll('.search-result').forEach(resultEl => {
                resultEl.addEventListener('click', () => {
                    const sessionId = resultEl.dataset.sessionId;
                    const messageIndex = parseInt(resultEl.dataset.messageIndex);
                    
                    if (sessionId !== this.currentSessionId) {
                        this.switchSession(sessionId);
                    }
                    
                    setTimeout(() => {
                        const messages = this.chatMessages.querySelectorAll('.message');
                        if (messages[messageIndex]) {
                            this.scrollToMessage(messages[messageIndex]);
                            this.highlightMessage(messages[messageIndex]);
                        }
                    }, 100);
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
            this.conversationAnalytics[this.currentSessionId] = {};
            this.saveSessions();
            this.updateAnalytics();
        }
    }
    
    exportHistory() {
        this.showExportOptions();
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
            // Prepare the prompt with system prompt and file context if set
            let fullPrompt = message;
            const systemPromptText = this.systemPrompt.value.trim();
            const sessionFiles = this.uploadedFiles[this.currentSessionId] || [];
            
            // Add file context if available
            const textFiles = sessionFiles.filter(f => isTextFile(f.name) && f.content);
            if (textFiles.length > 0) {
                const fileContext = textFiles.map(f => `File: ${f.name}\n${f.content.substring(0, 2000)}`).join('\n\n');
                fullPrompt = `Context from uploaded files:\n${fileContext}\n\nUser question: ${message}`;
            }
            
            if (systemPromptText) {
                fullPrompt = `${systemPromptText}\n\n${fullPrompt}`;
            }
 
            // Get advanced settings
            const advancedSettings = {
                temperature: parseFloat(this.temperatureSlider.value),
                num_predict: parseInt(this.maxTokensSlider.value),
                top_p: parseFloat(this.topPSlider.value)
            };
            
            const startTime = Date.now();
            
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
            const responseTime = Date.now() - startTime;
            
            this.hideTyping();
            this.addMessage(data.response, 'bot');
            
            // Update analytics with response time
            this.updateResponseAnalytics(responseTime, data.response);
            
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
            
            // Save session and update analytics
            this.saveCurrentSession();
            this.saveSessions();
            this.updateAnalytics();
        }
    }
 
    updateResponseAnalytics(responseTime, responseText) {
        const analytics = this.conversationAnalytics[this.currentSessionId] || {};
        
        if (!analytics.responseTimes) {
            analytics.responseTimes = [];
        }
        
        analytics.responseTimes.push(responseTime);
        analytics.averageResponseTime = analytics.responseTimes.reduce((a, b) => a + b, 0) / analytics.responseTimes.length;
        analytics.lastResponseTime = responseTime;
        analytics.lastResponseLength = responseText.length;
        
        this.conversationAnalytics[this.currentSessionId] = analytics;
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
        avatar.textContent = sender === 'user' ? '👤' : sender === 'system' ? '⚙️' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Parse markdown for bot messages
        if (sender === 'bot') {
            messageContent.innerHTML = parseMarkdown(content);
        } else {
            messageContent.textContent = content;
        }
 
        // Add timestamp (skip for system messages)
        if (sender !== 'system') {
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'message-timestamp';
            timestampDiv.textContent = formatTimestamp(timestamp);
            messageContent.appendChild(timestampDiv);
        }
 
        // Add message actions (skip for system messages)
        if (sender !== 'system') {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'action-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.title = 'Copy message';
            copyBtn.onclick = () => this.copyMessage(content);
            
            actionsDiv.appendChild(copyBtn);
            
            // Add model comparison button for bot messages
            if (sender === 'bot') {
                const compareBtn = document.createElement('button');
                compareBtn.className = 'action-btn';
                compareBtn.innerHTML = '⚖️';
                compareBtn.title = 'Compare with other models';
                compareBtn.onclick = () => this.compareResponse(this.lastUserMessage);
                actionsDiv.appendChild(compareBtn);
            }
            
            messageContent.appendChild(actionsDiv);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
 
    async compareResponse(userMessage) {
        if (!userMessage) return;
        
        try {
            const response = await fetch(`${this.ollamaUrl.value}/api/tags`);
            const data = await response.json();
            const models = data.models.filter(m => m.name !== this.modelSelector.value).slice(0, 2); // Compare with 2 other models
            
            if (models.length === 0) {
                this.addMessage('No other models available for comparison.', 'system');
                return;
            }
            
            this.addMessage(`🔄 Comparing responses from ${models.length} other models...`, 'system');
            
            for (const model of models) {
                try {
                    const compareResponse = await fetch(`${this.ollamaUrl.value}/api/generate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: model.name,
                            prompt: userMessage,
                            stream: false,
                            options: { temperature: 0.8, num_predict: 500 }
                        })
                    });
                    
                    if (compareResponse.ok) {
                        const compareData = await compareResponse.json();
                        this.addMessage(`**${model.name} says:**\n\n${compareData.response}`, 'bot');
                    }
                } catch (error) {
                    this.addMessage(`❌ Error getting response from ${model.name}`, 'system');
                }
            }
            
        } catch (error) {
            this.addMessage('❌ Error comparing responses: ' + error.message, 'system');
        }
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