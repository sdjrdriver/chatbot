# Changelog

All notable changes to this project will be documented in this file.

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