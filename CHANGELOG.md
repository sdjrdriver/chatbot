# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2025-05-22

### Major Release: File Integration & Intelligence

This release transforms the chatbot into a comprehensive AI workspace with file integration, conversation intelligence, and professional export capabilities.

#### File Integration & Analysis
- **Document Upload System**: Upload and manage multiple files per session
  - Support for text files, PDFs, JSON, CSV, Markdown, logs, and more
  - Drag-and-drop interface with file size and type detection
  - Client-side file processing and content extraction
- **Context Integration**: Seamlessly use uploaded files as conversation context
  - One-click context insertion from file content
  - Automatic text extraction from supported file types
  - Smart content preview and truncation
- **File Management Panel**: Comprehensive file organization
  - File list with name, size, and upload date
  - Quick actions: use in context, remove, preview
  - Per-session file storage and management
- **File Analytics**: Track file usage and impact on conversations

#### Conversation Intelligence
- **Real-time Analytics Dashboard**: Comprehensive conversation insights
  - Message counts (total, user, AI responses)
  - Word and estimated token counts
  - Reading time estimation and session duration
  - Top conversation topics extraction
- **Performance Metrics**: Track AI interaction performance
  - Response time monitoring and averages
  - Response length analysis
  - Model performance comparison data
- **Auto-Summarization**: AI-powered conversation summaries
  - Generate concise summaries of long conversations
  - One-click summary generation using current model
  - Export summaries with analytics data
- **Topic Analysis**: Automatic conversation theme extraction
  - Real-time topic identification from conversation content
  - Topic frequency analysis and trending

#### Enhanced Export System
- **Multiple Export Formats**: Professional export options
  - **JSON**: Complete data with full metadata and analytics
  - **Markdown**: Clean, formatted text with headers and structure
  - **HTML**: Professional web page format with styling
  - **Plain Text**: Simple, readable conversation format
- **Rich Export Data**: Comprehensive conversation preservation
  - Full message history with timestamps
  - Analytics data and performance metrics
  - File metadata and usage information
  - AI model settings and system prompts
- **Batch Export**: Export all sessions simultaneously
  - Single file containing all conversations
  - Global analytics across all sessions
  - Professional report generation
- **Export Modal**: Intuitive export interface

#### Conversation Templates
- **Pre-built Template Library**: Ready-to-use conversation starters
  - **Brainstorming Session**: Creative idea generation
  - **Interview Practice**: Job interview preparation
  - **Code Debugging**: Technical problem solving
  - **Learning Assistant**: Educational conversations
  - **Writing Helper**: Content creation and editing
- **Custom Template Creation**: Build personalized templates
  - Custom system prompts and starter messages
  - Template naming and organization
  - Persistent storage and reuse
- **Template Management**: Organize and maintain templates

#### Advanced Features
- **Response Comparison**: Compare AI responses across models
  - Multi-model response generation for same prompt
  - Side-by-side comparison display
  - Performance comparison metrics
- **Enhanced Search**: Improved cross-session search capabilities
  - Search results show session context and timestamps
  - Better result previews and navigation
  - Session-aware search result display
- **System Message Type**: Better UX with system notifications
  - Distinct styling for system messages
  - File upload confirmations and status updates
  - Template loading notifications

### Enhanced User Experience

#### Expanded Keyboard Shortcuts
- `Ctrl+U`: Upload files (new)
- `Ctrl+I`: Toggle analytics panel (new)
- All existing shortcuts enhanced with new features

#### Improved Interface Design
- **File Management Panel**: Dedicated file upload and management interface
- **Analytics Dashboard**: Professional analytics display with cards and metrics
- **Template Gallery**: Visual template selection interface
- **Export Modal**: Professional export dialog with format options
- **Enhanced Session Tabs**: Better visual indicators and management

#### Better Data Organization
- **Persistent File Storage**: Files saved with sessions across browser restarts
- **Analytics Persistence**: Conversation metrics tracked and saved
- **Template Storage**: Custom templates saved and synchronized
- **Enhanced Session Data**: Richer session metadata and history

### Technical Improvements

#### File Processing Architecture
- **Client-side Processing**: All file operations performed locally
- **Format Detection**: Smart file type recognition and handling
- **Content Extraction**: Text extraction from various file formats
- **Memory Management**: Efficient handling of large files
- **Error Handling**: Robust file upload and processing error management

#### Analytics Engine
- **Real-time Calculations**: Live analytics updates during conversations
- **Performance Tracking**: Response time and quality metrics
- **Data Visualization**: Professional analytics display
- **Export Integration**: Analytics included in all export formats

#### Export System Architecture
- **Multi-format Support**: Unified export system for all formats
- **Template Engine**: Professional formatting for each export type
- **Batch Processing**: Efficient handling of multi-session exports
- **Metadata Preservation**: Complete data integrity in exports

#### State Management Enhancements
- **File State**: Persistent file storage and management
- **Analytics State**: Real-time analytics calculation and storage
- **Template State**: Custom template storage and synchronization
- **Enhanced Session State**: Richer session data and metadata

### Performance Improvements
- **Efficient File Handling**: Optimized file processing and storage
- **Analytics Caching**: Smart caching of calculated metrics
- **Memory Management**: Better handling of large conversations and files
- **Export Optimization**: Faster export generation for large datasets

### Development Improvements
- **Modular Architecture**: Enhanced separation of concerns
- **Error Handling**: Comprehensive error management throughout
- **Code Organization**: Better structure for new features
- **Documentation**: Enhanced inline documentation and comments

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

## [1.3.0] - 2025-05-22

### Added
- **Message Formatting**: Full markdown support for AI responses
- **Smart Model Selector**: Auto-detect available Ollama models
- **Copy Message Functionality**: One-click copy for any message
- **Message Timestamps**: Display when each message was sent
- **Keyboard Shortcuts**: Enhanced productivity features
- **Response Regeneration**: Regenerate AI responses
- **Enhanced UI Elements**: Improved visual feedback throughout interface

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

---

## Upgrade Notes

### From v1.4.x to v1.5.0
- New file integration features require modern browser with File API support
- Analytics data will be calculated for existing sessions on first load
- New export formats provide more comprehensive data than previous JSON-only exports
- Custom templates can be created and will persist across browser sessions

### From v1.3.x to v1.4.0
- Existing chat history will be automatically migrated to new session system
- Advanced AI parameters will use default values until adjusted
- Search functionality works across all existing conversations
- All existing data and settings are preserved

### Breaking Changes
- **v1.5.0**: None - fully backward compatible
- **v1.4.0**: None - automatic migration of existing data
- **v1.3.0**: Model selection interface changed from text input to dropdown
- **v1.2.0**: localStorage structure enhanced for persistence

### Feature Deprecations
- No features have been deprecated in this release
- All previous functionality remains available and enhanced
- Legacy export format (simple JSON) still available alongside new formats