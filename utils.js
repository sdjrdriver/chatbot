// Utility functions for file handling and processing

class FileProcessor {
    constructor() {
        this.supportedTypes = {
            'text/plain': 'txt',
            'text/markdown': 'md',
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc'
        };
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
    }

    isValidFile(file) {
        if (file.size > this.maxFileSize) {
            throw new Error(`File "${file.name}" is too large. Maximum size is 10MB.`);
        }
        
        if (!this.supportedTypes[file.type] && !this.getFileExtension(file.name)) {
            throw new Error(`File type "${file.type}" is not supported.`);
        }
        
        return true;
    }

    getFileExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ['txt', 'md', 'pdf', 'doc', 'docx'].includes(ext) ? ext : null;
    }

    async processFile(file) {
        this.isValidFile(file);
        
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            extension: this.getFileExtension(file.name) || this.supportedTypes[file.type],
            content: '',
            processed: false,
            error: null
        };

        try {
            if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                fileData.content = await this.readTextFile(file);
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                fileData.content = await this.readPDFFile(file);
            } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                fileData.content = await this.readWordFile(file);
            }
            
            fileData.processed = true;
            fileData.wordCount = this.countWords(fileData.content);
            
        } catch (error) {
            fileData.error = error.message;
            console.error('File processing error:', error);
        }

        return fileData;
    }

    async readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    async readPDFFile(file) {
        // Simplified PDF reading - in production, you'd use PDF.js
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // This is a simplified version - real PDF parsing would require PDF.js
                    const arrayBuffer = e.target.result;
                    const text = `[PDF Content from ${file.name}]\n\nNote: PDF parsing requires additional libraries. File uploaded successfully but content extraction is simplified.`;
                    resolve(text);
                } catch (error) {
                    reject(new Error('Failed to parse PDF file'));
                }
            };
            reader.onerror = (e) => reject(new Error('Failed to read PDF file'));
            reader.readAsArrayBuffer(file);
        });
    }

    async readWordFile(file) {
        // Simplified Word document reading - in production, you'd use mammoth.js
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // This is a simplified version - real Word parsing would require mammoth.js
                    const text = `[Word Document Content from ${file.name}]\n\nNote: Word document parsing requires additional libraries. File uploaded successfully but content extraction is simplified.`;
                    resolve(text);
                } catch (error) {
                    reject(new Error('Failed to parse Word document'));
                }
            };
            reader.onerror = (e) => reject(new Error('Failed to read Word document'));
            reader.readAsArrayBuffer(file);
        });
    }

    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getFileIcon(extension) {
        const icons = {
            'txt': '📄',
            'md': '📝',
            'pdf': '📕',
            'doc': '📘',
            'docx': '📘'
        };
        return icons[extension] || '📄';
    }
}

// Conversation Analytics
class ConversationAnalytics {
    constructor() {
        this.startTime = Date.now();
        this.messageCount = 0;
        this.responseTimes = [];
        this.tokenEstimates = [];
    }

    recordMessage(type, content, responseTime = null) {
        this.messageCount++;
        
        if (responseTime) {
            this.responseTimes.push(responseTime);
        }

        // Rough token estimation (approximately 4 characters per token)
        const estimatedTokens = Math.ceil(content.length / 4);
        this.tokenEstimates.push(estimatedTokens);
    }

    getAverageResponseTime() {
        if (this.responseTimes.length === 0) return 0;
        const total = this.responseTimes.reduce((sum, time) => sum + time, 0);
        return Math.round(total / this.responseTimes.length);
    }

    getTotalTokens() {
        return this.tokenEstimates.reduce((sum, tokens) => sum + tokens, 0);
    }

    getSessionDuration() {
        return Date.now() - this.startTime;
    }

    generateSummary(messages) {
        const userMessages = messages.filter(m => m.sender === 'user').length;
        const botMessages = messages.filter(m => m.sender === 'bot').length;
        
        return {
            totalMessages: this.messageCount,
            userMessages,
            botMessages,
            averageResponseTime: this.getAverageResponseTime(),
            totalTokens: this.getTotalTokens(),
            sessionDuration: this.getSessionDuration()
        };
    }
}

// Conversation Intelligence
class ConversationIntelligence {
    constructor() {
        this.contextWindow = 10; // Number of recent messages to consider for context
    }

    async summarizeConversation(messages, model, ollamaUrl) {
        if (messages.length < 3) {
            return "Conversation too short to summarize.";
        }

        const conversationText = messages
            .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        const summaryPrompt = `Please provide a concise summary of this conversation, highlighting the main topics discussed and key points:\n\n${conversationText}\n\nSummary:`;

        try {
            const response = await fetch(`${ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    prompt: summaryPrompt,
                    stream: false,
                    options: { temperature: 0.3, num_predict: 200 }
                })
            });

            if (!response.ok) throw new Error('Failed to generate summary');
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Summary generation error:', error);
            return "Failed to generate summary. Please check your connection.";
        }
    }

    getRelevantContext(messages, currentMessage) {
        // Get the last N messages for context
        const recentMessages = messages.slice(-this.contextWindow);
        
        // Filter for relevance (simplified - could use semantic similarity)
        const keywords = this.extractKeywords(currentMessage);
        const relevantMessages = recentMessages.filter(msg => 
            keywords.some(keyword => 
                msg.content.toLowerCase().includes(keyword.toLowerCase())
            )
        );

        return relevantMessages.length > 0 ? relevantMessages : recentMessages.slice(-3);
    }

    extractKeywords(text) {
        // Simple keyword extraction (in production, use more sophisticated NLP)
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        return words
            .filter(word => word.length > 3 && !stopWords.includes(word))
            .slice(0, 5); // Top 5 keywords
    }

    async generateAlternativeResponses(prompt, model, ollamaUrl, count = 2) {
        const responses = [];
        
        for (let i = 0; i < count; i++) {
            try {
                const response = await fetch(`${ollamaUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: model,
                        prompt: prompt,
                        stream: false,
                        options: { 
                            temperature: 0.8 + (i * 0.2), // Vary temperature for diversity
                            num_predict: 2000 
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    responses.push({
                        id: i + 1,
                        content: data.response,
                        temperature: 0.8 + (i * 0.2)
                    });
                }
            } catch (error) {
                console.error(`Failed to generate alternative response ${i + 1}:`, error);
            }
        }

        return responses;
    }
}

// Export utilities
window.FileProcessor = FileProcessor;
window.ConversationAnalytics = ConversationAnalytics;
window.ConversationIntelligence = ConversationIntelligence;