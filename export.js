// Enhanced Export System for Ollama Chatbot

class ExportManager {
    constructor() {
        this.exportFormats = {
            json: this.exportToJSON,
            markdown: this.exportToMarkdown,
            txt: this.exportToText,
            pdf: this.exportToPDF
        };
    }

    async exportConversation(sessions, options) {
        const { format, scope, sessionIds, includeTimestamps, includeSystemPrompts, includeMetadata } = options;
        
        let dataToExport;
        
        switch (scope) {
            case 'current':
                dataToExport = [sessions[sessionIds[0]]];
                break;
            case 'selected':
                dataToExport = sessionIds.map(id => sessions[id]).filter(Boolean);
                break;
            case 'all':
                dataToExport = Object.values(sessions);
                break;
            default:
                throw new Error('Invalid export scope');
        }

        const exportMethod = this.exportFormats[format];
        if (!exportMethod) {
            throw new Error(`Unsupported export format: ${format}`);
        }

        return await exportMethod.call(this, dataToExport, {
            includeTimestamps,
            includeSystemPrompts,
            includeMetadata
        });
    }

    exportToJSON(sessions, options) {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: "1.5.0",
            totalSessions: sessions.length,
            sessions: sessions.map(session => ({
                id: session.id,
                name: session.name,
                messageCount: session.history.length,
                ...(options.includeMetadata && {
                    createdAt: session.createdAt || new Date().toISOString(),
                    lastActive: session.lastActive || new Date().toISOString()
                }),
                messages: session.history.map(msg => ({
                    sender: msg.sender,
                    content: msg.content,
                    ...(options.includeTimestamps && { timestamp: msg.timestamp })
                }))
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        return {
            blob,
            filename: this.generateFilename('json', sessions.length > 1 ? 'multiple-sessions' : sessions[0].name)
        };
    }

    exportToMarkdown(sessions, options) {
        let markdown = '# Ollama Chatbot Export\n\n';
        
        if (options.includeMetadata) {
            markdown += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
            markdown += `**Sessions:** ${sessions.length}\n\n`;
        }

        sessions.forEach((session, index) => {
            markdown += `## ${session.name}\n\n`;
            
            if (options.includeMetadata) {
                markdown += `**Messages:** ${session.history.length}\n\n`;
            }

            session.history.forEach(msg => {
                const sender = msg.sender === 'user' ? '**You**' : '**Assistant**';
                markdown += `${sender}: ${msg.content}\n\n`;
                
                if (options.includeTimestamps && msg.timestamp) {
                    markdown += `*${new Date(msg.timestamp).toLocaleString()}*\n\n`;
                }
            });

            if (index < sessions.length - 1) {
                markdown += '---\n\n';
            }
        });

        const blob = new Blob([markdown], { type: 'text/markdown' });
        
        return {
            blob,
            filename: this.generateFilename('md', sessions.length > 1 ? 'multiple-sessions' : sessions[0].name)
        };
    }

    exportToText(sessions, options) {
        let text = 'OLLAMA CHATBOT EXPORT\n';
        text += '='.repeat(50) + '\n\n';
        
        if (options.includeMetadata) {
            text += `Export Date: ${new Date().toLocaleDateString()}\n`;
            text += `Sessions: ${sessions.length}\n\n`;
        }

        sessions.forEach((session, index) => {
            text += `SESSION: ${session.name}\n`;
            text += '-'.repeat(30) + '\n\n';
            
            session.history.forEach(msg => {
                const sender = msg.sender === 'user' ? 'YOU' : 'ASSISTANT';
                text += `${sender}: ${msg.content}\n\n`;
                
                if (options.includeTimestamps && msg.timestamp) {
                    text += `Time: ${new Date(msg.timestamp).toLocaleString()}\n\n`;
                }
            });

            if (index < sessions.length - 1) {
                text += '\n' + '='.repeat(50) + '\n\n';
            }
        });

        const blob = new Blob([text], { type: 'text/plain' });
        
        return {
            blob,
            filename: this.generateFilename('txt', sessions.length > 1 ? 'multiple-sessions' : sessions[0].name)
        };
    }

    exportToPDF(sessions, options) {
        let htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ollama Chatbot Export</title><style>body{font-family:Arial,sans-serif;line-height:1.6;margin:40px;color:#333}.header{text-align:center;margin-bottom:30px;border-bottom:2px solid #667eea;padding-bottom:20px}.session{margin-bottom:40px;page-break-inside:avoid}.session-title{font-size:20px;font-weight:bold;color:#667eea;margin-bottom:20px}.message{margin-bottom:15px;padding:10px;border-left:3px solid #e1e5e9}.message.user{border-left-color:#28a745;background:#f8f9fa}.message.bot{border-left-color:#667eea}.sender{font-weight:bold;margin-bottom:5px}.timestamp{font-size:12px;color:#666;margin-top:5px}.metadata{background:#f8f9fa;padding:15px;border-radius:5px;margin-bottom:20px}@media print{body{margin:20px}.message{page-break-inside:avoid}}</style></head><body><div class="header"><h1>Ollama Chatbot Export</h1>`;
        
        if (options.includeMetadata) {
            htmlContent += `<div class="metadata"><strong>Export Date:</strong> ${new Date().toLocaleDateString()}<br><strong>Sessions:</strong> ${sessions.length}<br><strong>Total Messages:</strong> ${sessions.reduce((sum, s) => sum + s.history.length, 0)}</div>`;
        }
        
        htmlContent += `</div>`;

        sessions.forEach((session) => {
            htmlContent += `<div class="session"><div class="session-title">${session.name}</div>`;
            
            session.history.forEach(msg => {
                const senderClass = msg.sender === 'user' ? 'user' : 'bot';
                const senderName = msg.sender === 'user' ? 'You' : 'Assistant';
                
                htmlContent += `<div class="message ${senderClass}"><div class="sender">${senderName}:</div><div class="content">${msg.content.replace(/\n/g, '<br>')}</div>`;
                
                if (options.includeTimestamps && msg.timestamp) {
                    htmlContent += `<div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>`;
                }
                
                htmlContent += `</div>`;
            });
            
            htmlContent += `</div>`;
        });

        htmlContent += `</body></html>`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);

        return null;
    }

    generateFilename(extension, sessionName) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const safeName = sessionName.replace(/[^a-zA-Z0-9]/g, '_');
        return `ollama-chat-${safeName}-${timestamp}.${extension}`;
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

class TemplateManager {
    constructor() {
        this.templates = {
            coding: {
                name: "Coding Assistant",
                systemPrompt: "You are an expert software developer. Help with coding questions, debugging, and best practices.",
                starterMessages: ["Help me debug this code", "Explain this programming concept", "Review my code for improvements", "What's the best practice for..."]
            },
            writing: {
                name: "Writing Helper",
                systemPrompt: "You are a professional writing assistant. Help with grammar, style, structure, and creative writing.",
                starterMessages: ["Help me improve this text", "Brainstorm ideas for...", "Check my grammar and style", "Help me write a..."]
            },
            analysis: {
                name: "Data Analyst",
                systemPrompt: "You are a data analysis expert. Help interpret data, create insights, and explain statistical concepts.",
                starterMessages: ["Analyze this data set", "Explain this statistical concept", "What insights can you find?", "Help me visualize this data"]
            }
        };
    }

    getTemplate(templateId) {
        return this.templates[templateId] || null;
    }

    getAllTemplates() {
        return Object.entries(this.templates).map(([id, template]) => ({ id, ...template }));
    }

    applyTemplate(templateId, chatbot) {
        const template = this.getTemplate(templateId);
        if (!template) return false;
        chatbot.systemPrompt.value = template.systemPrompt;
        chatbot.saveSystemPrompt();
        const sessionId = chatbot.generateSessionId();
        chatbot.sessions[sessionId] = {
            id: sessionId,
            name: template.name,
            history: [],
            isActive: false,
            template: templateId
        };
        chatbot.switchSession(sessionId);
        return true;
    }
}

class ComparisonManager {
    constructor() {
        this.activeComparisons = new Map();
    }

    async generateComparison(prompt, model, ollamaUrl, systemPrompt = '') {
        const comparisonId = Date.now().toString();
        
        try {
            const responses = await Promise.all([
                this.generateResponse(prompt, model, ollamaUrl, systemPrompt, { temperature: 0.3 }),
                this.generateResponse(prompt, model, ollamaUrl, systemPrompt, { temperature: 0.8 }),
                this.generateResponse(prompt, model, ollamaUrl, systemPrompt, { temperature: 1.2 })
            ]);

            const comparison = {
                id: comparisonId,
                prompt,
                responses: responses.map((response, index) => ({
                    id: `response_${index}`,
                    content: response,
                    temperature: [0.3, 0.8, 1.2][index],
                    label: ['Conservative', 'Balanced', 'Creative'][index]
                })),
                timestamp: new Date().toISOString()
            };

            this.activeComparisons.set(comparisonId, comparison);
            return comparison;

        } catch (error) {
            console.error('Comparison generation failed:', error);
            throw error;
        }
    }

    async generateResponse(prompt, model, ollamaUrl, systemPrompt, options) {
        let fullPrompt = prompt;
        if (systemPrompt.trim()) {
            fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
        }

        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt: fullPrompt,
                stream: false,
                options
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    }

    selectResponse(comparisonId, responseId) {
        const comparison = this.activeComparisons.get(comparisonId);
        if (!comparison) return null;

        const selectedResponse = comparison.responses.find(r => r.id === responseId);
        if (!selectedResponse) return null;

        comparison.selectedResponse = responseId;
        this.activeComparisons.set(comparisonId, comparison);

        return selectedResponse.content;
    }

    getComparison(comparisonId) {
        return this.activeComparisons.get(comparisonId);
    }

    clearComparison(comparisonId) {
        this.activeComparisons.delete(comparisonId);
    }
}

window.ExportManager = ExportManager;
window.TemplateManager = TemplateManager;
window.ComparisonManager = ComparisonManager;