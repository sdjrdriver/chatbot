# Ollama Chatbot

A professional-grade web interface for interacting with Ollama AI models with advanced conversation management, file integration, and conversation intelligence.

## Features

### Core Functionality
- Clean, responsive design optimized for productivity
- Real-time chat interface with markdown support
- Connection status monitoring and auto-model detection
- Persistent settings and preferences

### Theme Support
- Light/Dark mode toggle with smooth transitions
- Eye-friendly color schemes
- Consistent theming across all components

### Message Management
- **Full Markdown Support**: Headers, code blocks, lists, formatting
- **Copy Functionality**: One-click copy for any message
- **Message Timestamps**: Track conversation timing
- **Message Search**: Find specific content across conversations
- **Response Comparison**: Compare AI responses across different models

### New in v1.5.0 - Professional-Grade Features

#### 🗂️ File Integration & Analysis
- **Document Upload**: Upload and analyze PDFs, text files, CSV, JSON, and more
- **Context Integration**: Use uploaded files as conversation context automatically
- **File Management**: Upload, view, and manage multiple files per session
- **Smart File Handling**: Automatic text extraction and content preview
- **File Actions**: Quick context insertion and file removal

#### 🧠 Conversation Intelligence
- **Real-time Analytics**: Track messages, words, tokens, and session duration
- **Auto-Summarization**: AI-powered conversation summaries
- **Topic Analysis**: Automatic extraction of conversation themes
- **Performance Metrics**: Response times and model performance tracking
- **Reading Time Estimation**: Estimated time to read conversation content

#### 📄 Enhanced Export System
- **Multiple Formats**: Export to JSON, Markdown, HTML, and Plain Text
- **Professional Templates**: Beautifully formatted exports with metadata
- **Batch Export**: Export all sessions at once with global analytics
- **Rich Metadata**: Include analytics, file info, and model parameters
- **Custom Formatting**: Different layouts for different use cases

#### 🔧 Advanced Conversation Features
- **Conversation Templates**: Pre-built templates for brainstorming, interviews, debugging, learning, and writing
- **Custom Templates**: Create and save your own conversation starters
- **Enhanced Search**: Cross-session search with session navigation
- **Model Comparison**: Compare responses from multiple models side-by-side
- **Smart Context**: Better context preservation across long conversations

### Enhanced User Experience

#### Multiple Conversation Sessions
- **Tabbed Interface**: Manage multiple chat sessions simultaneously
- **Session Naming**: Double-click tabs to rename conversations
- **Session Persistence**: All sessions saved and restored automatically
- **Easy Navigation**: Switch between conversations instantly

#### Advanced AI Parameter Controls
- **Temperature Control**: Adjust response creativity (0.0 - 2.0)
- **Max Tokens**: Control response length (50 - 4000 tokens)
- **Top P**: Fine-tune response diversity (0.0 - 1.0)
- **Real-time Adjustment**: All settings apply immediately

#### Powerful Message Search
- **Cross-Session Search**: Find messages across all conversations
- **Live Results**: Real-time search as you type
- **Message Navigation**: Click results to jump to specific messages
- **Content Highlighting**: Visual highlighting of search results

#### Conversation Branching
- **Branch from Any Point**: Create alternative conversation paths
- **Context Preservation**: Maintains conversation history up to branch point
- **Experiment Safely**: Try different approaches without losing original conversation

### Keyboard Shortcuts
- **Ctrl+K**: Clear current session
- **Ctrl+E**: Export current session (opens format selection)
- **Ctrl+/**: Focus input field
- **Ctrl+T**: Create new session
- **Ctrl+F**: Toggle search
- **Ctrl+U**: Upload files
- **Ctrl+I**: Toggle analytics panel
- **Enter**: Send message
- **Shift+Enter**: New line in message

## Technical Architecture

### File Structure
- **index.html** - Clean HTML structure with new UI elements
- **style.css** - Complete styling, themes, and new component styles
- **script.js** - Enhanced application logic with v1.5.0 features
- **README.md** - Comprehensive documentation
- **CHANGELOG.md** - Detailed version history

### Benefits of Modular Design
- **Maintainability**: Separate concerns for easier development
- **Performance**: Browser caching and parallel loading
- **Scalability**: Easy to add build tools and testing
- **Collaboration**: Multiple developers can work simultaneously

## Setup
1. Ensure Ollama is running and accessible
2. Configure CORS: `Environment="OLLAMA_ORIGINS=*"`
3. Open index.html in a web browser or serve via HTTP server
4. The interface will auto-detect available models

## Usage Guide

### File Management
- **Upload Files**: Click "📁 Files" button or use Ctrl+U
- **Supported Formats**: Text files, JSON, CSV, Markdown, and more
- **Use in Context**: Click 🔗 button to add file content to your message
- **File Organization**: Each session maintains its own file collection