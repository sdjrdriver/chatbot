# Ollama Chatbot

A professional-grade web interface for interacting with Ollama AI models with advanced conversation management and AI parameter controls.

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

### New in v1.4.0 - Advanced Conversation Management

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

### Enhanced User Experience
- **Keyboard Shortcuts**: 
  - `Ctrl+K`: Clear current session
  - `Ctrl+E`: Export current session
  - `Ctrl+/`: Focus input field
  - `Ctrl+T`: Create new session
  - `Ctrl+F`: Toggle search
- **Response Controls**: Regenerate responses, branch conversations
- **Visual Feedback**: Tooltips, animations, and status indicators

## Technical Architecture

### File Structure
- index.html - Clean HTML structure
- style.css - Complete styling and themes
- script.js - Application logic and features
- README.md - Documentation
- CHANGELOG.md - Version history

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

### Session Management
- **New Session**: Click the "+" button in the session tabs
- **Switch Sessions**: Click on any session tab
- **Rename Session**: Double-click on a session tab
- **Close Session**: Click the "×" button (minimum one session required)

### Advanced AI Controls
- **Access Controls**: Click the "🎛️ Advanced" button
- **Temperature**: Lower values (0.1-0.3) for focused responses, higher (0.8-1.5) for creative responses
- **Max Tokens**: Limit response length to control costs and focus
- **Top P**: Lower values for more focused responses, higher for more diverse outputs

### Search Functionality
- **Open Search**: Click "🔍 Search" or press `Ctrl+F`
- **Search Results**: Click any result to navigate to that message
- **Cross-Session**: Search works across all conversation sessions

### Conversation Branching
- **Create Branch**: Click "🌿 Branch" after any AI response
- **New Session**: Creates a new session with conversation history up to the branch point
- **Alternative Paths**: Explore different conversation directions

### System Prompts
- **Custom Behavior**: Define how the AI should respond
- **Quick Presets**: Choose from Helpful, Coding, Creative, or Technical assistants
- **Persistent Settings**: System prompts save automatically

## Export Features
Exported conversations include:
- Complete message history with timestamps
- Session name and metadata
- Current model and system prompt
- Advanced AI parameter settings
- JSON format for easy parsing and integration

## Keyboard Shortcuts
- **Ctrl+K**: Clear current session history
- **Ctrl+E**: Export current session
- **Ctrl+/**: Focus input field from anywhere
- **Ctrl+T**: Create new conversation session
- **Ctrl+F**: Toggle message search
- **Enter**: Send message
- **Shift+Enter**: New line in message

## Technical Features
- **No External Dependencies**: Fully client-side application
- **Advanced State Management**: Persistent sessions and settings
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Browser Storage**: Uses localStorage for data persistence
- **Modern JavaScript**: ES6+ features with backward compatibility

## Model Management
- **Auto-Detection**: Automatically discovers available Ollama models
- **Model Information**: Shows model names and file sizes
- **Easy Switching**: Change models without losing conversation context
- **Persistent Selection**: Remembers your preferred model

## Requirements
- Ollama server running with at least one model
- Modern web browser (Chrome, Firefox, Safari, Edge)
- CORS enabled on Ollama server: `Environment="OLLAMA_ORIGINS=*"`
- Minimum 4GB RAM recommended for optimal performance

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Local Development
1. Clone or download the repository
2. Navigate to chatbot directory
3. Start development server: `python3 -m http.server 8080`
4. Visit http://localhost:8080

### File Modification
- **HTML Changes**: Edit `index.html` for structure modifications
- **Styling Changes**: Edit `style.css` for visual improvements
- **Feature Changes**: Edit `script.js` for functionality updates

### Testing
- Test in multiple browsers for compatibility
- Test responsive design on different screen sizes
- Verify all keyboard shortcuts work correctly
- Test session management and data persistence

## Privacy & Security
- **Local Storage Only**: All data stored locally in your browser
- **No External Calls**: Communicates only with your Ollama server
- **Private Conversations**: Nothing sent to external services
- **Secure**: All communication over HTTP/HTTPS as configured

## Troubleshooting

### Common Issues
- **CORS Errors**: Ensure `OLLAMA_ORIGINS=*` is set in Ollama configuration
- **Model Not Found**: Verify model is installed with `ollama list`
- **Connection Failed**: Check Ollama server is running and accessible
- **Features Not Working**: Ensure JavaScript is enabled in browser

### Performance Tips
- **Close Unused Sessions**: Reduce memory usage by closing old sessions
- **Clear Large Histories**: Export and clear very long conversations
- **Use Appropriate Models**: Smaller models respond faster
- **Optimize Parameters**: Lower max tokens for faster responses