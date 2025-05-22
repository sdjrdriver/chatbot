# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2025-05-22

### Major Features Added

#### Multiple Conversation Sessions
- **Tabbed Interface**: Manage unlimited chat sessions with intuitive tab system
- **Session Persistence**: All sessions automatically saved and restored
- **Session Management**: Create, close, rename, and switch between sessions
- **Individual Session History**: Each session maintains its own complete message history

#### Advanced AI Parameter Controls
- **Temperature Slider**: Adjust response creativity (0.0 - 2.0)
- **Max Tokens Control**: Set response length limits (50 - 4000 tokens)
- **Top P Parameter**: Fine-tune response diversity (0.0 - 1.0)
- **Real-time Settings**: All parameters apply immediately to next response
- **Persistent Settings**: Advanced controls saved across sessions

#### Powerful Message Search
- **Live Search**: Real-time search across all messages
- **Cross-Session Search**: Find content across all conversation sessions
- **Search Results Panel**: Click results to navigate directly to messages
- **Message Highlighting**: Visual highlighting of search matches
- **Content Preview**: See message previews in search results

#### Conversation Branching
- **Branch Creation**: Create alternative conversation paths from any AI response
- **Context Preservation**: New branches maintain conversation history up to branch point
- **Experiment Safely**: Try different approaches without losing original conversation
- **Smart Branching**: Automatically continues conversation in new branch

### Enhanced User Experience

#### Expanded Keyboard Shortcuts
- `Ctrl+T`: Create new conversation session
- `Ctrl+F`: Toggle message search functionality
- Enhanced tooltip showing all available shortcuts

#### Improved Interface Design
- **Larger Chat Container**: Increased from 600px to 700px height
- **Optimized Layout**: Better space utilization for new features
- **Responsive Session Tabs**: Horizontal scrolling for many sessions
- **Enhanced Visual Hierarchy**: Clearer organization of controls

#### Better Control Organization
- **Grouped Controls**: Logical grouping of related functionality
- **Collapsible Panels**: Advanced controls and search can be hidden
- **Visual Indicators**: Clear feedback for active states and interactions

### Technical Improvements

#### Modular Architecture
- **Separated Files**: Split single HTML into index.html, style.css, script.js
- **Better Maintainability**: Cleaner code organization and development workflow
- **Performance Benefits**: Browser caching and parallel file loading
- **Development Benefits**: Easier debugging and collaboration

#### State Management
- **Session Storage**: Robust session management with localStorage
- **Data Persistence**: All user data automatically saved and restored
- **Performance Optimization**: Efficient rendering of multiple sessions
- **Memory Management**: Smart cleanup of inactive session data

#### API Integration
- **Advanced Parameters**: Full integration with Ollama's parameter system
- **Enhanced Error Handling**: Better error messages and recovery
- **Request Optimization**: Improved API call efficiency

#### Code Architecture
- **Modular Design**: Cleaner separation of concerns
- **Event Handling**: Improved event management system
- **Global State**: Better global state management for cross-component communication

### UI/UX Improvements

#### Visual Enhancements
- **Session Tab Design**: Professional tab interface with close buttons
- **Search Interface**: Elegant search panel with results display
- **Advanced Controls**: Intuitive slider controls with real-time values
- **Branch Button**: Clear visual indication for branching capability

#### Interaction Improvements
- **Double-click Rename**: Intuitive session renaming
- **Hover States**: Enhanced hover effects throughout interface
- **Loading States**: Better visual feedback during operations
- **Responsive Design**: Improved mobile and tablet experience

### Export Enhancements
- **Session Metadata**: Export includes session name and creation info
- **Advanced Settings**: Export includes all AI parameter settings
- **Enhanced Filename**: More descriptive export filenames with session names

### Technical Specifications
- **Session Management**: Unlimited concurrent sessions
- **Search Performance**: Optimized for large conversation histories
- **Storage Efficiency**: Compressed data storage for better performance
- **Browser Compatibility**: Enhanced support for all modern browsers

### Development Improvements
- **File Structure**: Clean separation of HTML, CSS, and JavaScript
- **Maintainability**: Easier to modify and extend individual components
- **Version Control**: Better Git diffs and collaboration workflow
- **Build Ready**: Prepared for future build tools and optimization

## [1.3.0] - 2025-05-22

### Added
- **Message Formatting**: Full markdown support for AI responses
  - Headers (H1, H2, H3)
  - Code blocks with syntax highlighting
  - Inline code formatting
  - Bold and italic text
  - Blockquotes and lists
- **Smart Model Selector**: Auto-detect available Ollama models
  - Dropdown shows model names and file sizes
  - Automatic model discovery from Ollama API
  - Persistent model selection
- **Copy Message Functionality**: One-click copy for any message
  - Copy button appears on message hover
  - Visual feedback when copying
  - Works for both user and AI messages
- **Message Timestamps**: Display when each message was sent
  - Formatted timestamps on all messages
  - Persistent timestamps in chat history
- **Keyboard Shortcuts**: Enhanced productivity features
  - `Ctrl+K`: Clear chat history
  - `Ctrl+E`: Export conversation
  - `Ctrl+/`: Focus input field
- **Response Regeneration**: Regenerate AI responses
  - 🔄 Regenerate button appears after AI responses
  - Maintains conversation context
  - Useful for getting alternative responses
- **Enhanced UI Elements**:
  - Tooltip for keyboard shortcuts in header
  - Improved message hover states
  - Better visual feedback throughout interface
  - Copy confirmation notifications

### Changed
- Model selection now uses dropdown instead of text input
- Improved message layout with action buttons
- Enhanced visual hierarchy and spacing
- Better error handling for model selection

### Technical Improvements
- Added lightweight markdown parser
- Improved message rendering performance
- Better state management for UI controls
- Enhanced accessibility with keyboard navigation

## [1.2.0] - 2025-05-22

### Added
- Persistent chat history using localStorage
- Chat export functionality (JSON format)
- System prompt customization
- Preset system prompts (Helpful, Coding, Creative, Technical)
- Clear history functionality with confirmation
- Enhanced control panel with action buttons

## [1.1.0] - 2025-05-22

### Added
- Dark mode theme with toggle button
- Theme persistence using localStorage
- Smooth transitions between themes
- Eye-friendly dark color scheme

## [1.0.0] - 2025-05-22

### Added
- Initial chatbot interface
- Real-time communication with Ollama API
- Connection status monitoring
- Configurable Ollama URL and model settings
- Typing indicator with animated dots
- Responsive design with gradient backgrounds
- Message animations and smooth transitions
- User and bot message differentiation with avatars
- Auto-scroll to bottom functionality
- Error handling for connection issues
- Enter key support for sending messages