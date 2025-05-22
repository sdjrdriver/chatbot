# Ollama Chatbot

A modern web interface for interacting with Ollama AI models with advanced features and beautiful UI.

## Features

### Core Functionality
- Clean, responsive design
- Real-time chat interface
- Connection status monitoring
- Configurable Ollama URL
- Typing indicators and smooth animations

### Theme Support
- Light/Dark mode toggle
- Persistent theme preference
- Smooth theme transitions

### Advanced Features
- Persistent chat history
- Chat export functionality  
- System prompt customization
- Preset system prompts for different use cases

### New in v1.3.0
- **Message Formatting**: Full markdown support (headers, code blocks, lists, etc.)
- **Smart Model Selector**: Auto-detect and switch between available Ollama models
- **Copy Messages**: One-click copy functionality for any message
- **Message Timestamps**: See when each message was sent
- **Keyboard Shortcuts**: 
  - `Ctrl+K`: Clear chat history
  - `Ctrl+E`: Export chat
  - `Ctrl+/`: Focus input field
- **Response Regeneration**: Regenerate the last AI response
- **Enhanced UI**: Better message actions, tooltips, and visual feedback

## Setup
1. Ensure Ollama is running and accessible
2. Configure CORS: `Environment="OLLAMA_ORIGINS=*"`
3. Open index.html in a web browser
4. The interface will auto-detect available models

## Usage

### Basic Chat
- Select your preferred model from the dropdown
- Start chatting with your AI model
- Use markdown formatting in messages for rich text

### System Prompts
- Click the ⚙️ button to customize AI behavior
- Choose from preset prompts or create your own
- System prompts persist across sessions

### Keyboard Shortcuts
- **Ctrl+K**: Quick clear chat history
- **Ctrl+E**: Export current conversation
- **Ctrl+/**: Focus the input field from anywhere

### Message Management
- Hover over messages to see copy and action buttons
- Click 📋 to copy any message to clipboard
- Use 🔄 Regenerate to get a different AI response

## Model Management
The interface automatically detects available Ollama models and shows:
- Model name and file size
- Easy switching between models
- Persistent model selection

## Export Formats
Exported chats include:
- Complete message history with timestamps
- Current model and system prompt settings
- JSON format for easy parsing

## Requirements
- Ollama server running with at least one model
- Modern web browser (Chrome, Firefox, Safari, Edge)
- CORS enabled on Ollama server

## Technical Features
- No external dependencies
- Fully client-side application
- Markdown rendering for rich text
- Responsive design for all screen sizes
- Persistent settings using localStorage