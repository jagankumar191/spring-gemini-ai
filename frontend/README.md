# AI Chatbot Frontend Application

A modern, responsive AI chatbot interface that connects to a Spring Boot backend API.

## Features

✨ **Modern Design**
- Premium gradient-based color scheme
- Smooth animations and micro-interactions
- Dark mode interface
- Glassmorphism effects

💬 **Chat Features**
- Real-time message exchange
- Typing indicators
- Message timestamps
- Suggestion chips for quick prompts
- Auto-resizing text input
- Smooth scrolling

📱 **Responsive Design**
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface

🔗 **Backend Integration**
- Connects to `http://localhost:8080/api/ai/chat`
- GET request with prompt as query parameter
- Error handling and timeout management
- Loading states

## Project Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with design tokens
└── script.js       # API integration and UI logic
```

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- Backend server running on `http://localhost:8080`

### Running the Application

1. **Start the Backend Server**
   
   Make sure your Spring Boot backend is running on `http://localhost:8080`

2. **Open the Frontend**
   
   Simply open `index.html` in your web browser:
   
   ```bash
   # Navigate to the frontend directory
   cd frontend
   
   # Open in default browser (Windows)
   start index.html
   
   # Or use a local server (recommended)
   npx http-server -p 3000
   ```

3. **Start Chatting**
   
   - Type your message in the input field
   - Press Enter to send (Shift+Enter for new line)
   - Click suggestion chips for quick prompts
   - Use the trash icon to clear chat history

## API Integration

The application sends GET requests to:
```
http://localhost:8080/api/ai/chat?prompt=<your_message>
```

### Expected Response Format

The backend can return either:
- **JSON**: `{ "response": "AI message", "message": "AI message", ... }`
- **Plain Text**: Direct text response

## Configuration

To modify the API endpoint, edit `script.js`:

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:8080',
    endpoint: '/api/ai/chat',
    timeout: 30000 // 30 seconds
};
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Features Breakdown

### UI Components

- **Header**: Logo, status indicator, and action buttons
- **Chat Container**: Scrollable message area with custom scrollbar
- **Messages**: User and bot message bubbles with avatars
- **Input Area**: Auto-resizing textarea with send button
- **Welcome Screen**: Initial state with suggestion chips
- **Loading Overlay**: Visual feedback during API calls

### Styling Features

- CSS custom properties (design tokens)
- Linear gradients for modern aesthetics
- Smooth transitions and animations
- Hover effects and micro-interactions
- Responsive breakpoints for mobile/tablet/desktop

### JavaScript Features

- Async/await API calls with error handling
- DOM manipulation for dynamic content
- Event delegation for suggestion chips
- Auto-scroll on new messages
- Input validation and sanitization
- Request timeout management

## Troubleshooting

### "Unable to connect to the server"

1. Ensure backend is running on `http://localhost:8080`
2. Check CORS settings on backend
3. Verify the endpoint URL is correct

### Messages not appearing

1. Check browser console for errors
2. Verify API response format
3. Ensure JavaScript is enabled

### Styling issues

1. Clear browser cache
2. Check if `styles.css` is loaded
3. Verify browser compatibility

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --bg-primary: #0f0f1e;
    /* ... more variables */
}
```

### Fonts

Change the Google Fonts import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## Performance

- Optimized animations using CSS transforms
- Request debouncing for input
- Lazy loading for messages
- Efficient DOM updates

## Accessibility

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly

## License

This project is part of the spring-gemini-ai application.

## Support

For issues or questions, please check:
1. Browser console for errors
2. Network tab for API calls
3. Backend server logs
