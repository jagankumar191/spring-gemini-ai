// ========================================
// Configuration
// ========================================
const API_CONFIG = {
    baseURL: 'http://localhost:8080',
    endpoint: '/api/ai/chat',
    timeout: 30000 // 30 seconds
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    chatContainer: document.getElementById('chatContainer'),
    messagesWrapper: document.getElementById('messagesWrapper'),
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    clearButton: document.getElementById('clearChat'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    suggestionChips: document.querySelectorAll('.chip')
};

// ========================================
// State Management
// ========================================
const state = {
    messages: [],
    isLoading: false
};

// ========================================
// Utility Functions
// ========================================
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function autoResizeTextarea() {
    elements.messageInput.style.height = 'auto';
    elements.messageInput.style.height = Math.min(elements.messageInput.scrollHeight, 150) + 'px';
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        elements.chatContainer.scrollTo({
            top: elements.chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    });
}

function setLoading(loading) {
    state.isLoading = loading;
    elements.sendButton.disabled = loading;

    if (loading) {
        elements.loadingOverlay.classList.add('active');
    } else {
        elements.loadingOverlay.classList.remove('active');
    }
}

// ========================================
// UI Functions
// ========================================
function hideWelcomeSection() {
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            welcomeSection.remove();
        }, 300);
    }
}

function createMessageElement(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? 'U' : 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = sanitizeHTML(message);

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = getCurrentTime();

    contentDiv.appendChild(bubble);
    contentDiv.appendChild(time);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    return messageDiv;
}

function createTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot typing-indicator';
    messageDiv.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'AI';

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'typing-dots';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        dotsContainer.appendChild(dot);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(dotsContainer);

    return messageDiv;
}

function addMessage(message, type) {
    hideWelcomeSection();

    const messageElement = createMessageElement(message, type);
    elements.messagesWrapper.appendChild(messageElement);

    state.messages.push({ message, type, timestamp: new Date() });

    scrollToBottom();
}

function showTypingIndicator() {
    const indicator = createTypingIndicator();
    elements.messagesWrapper.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// ========================================
// API Functions
// ========================================
async function sendMessageToAPI(prompt) {
    const url = new URL(API_CONFIG.endpoint, API_CONFIG.baseURL);
    url.searchParams.append('prompt', prompt);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Try to parse as JSON first
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data.response || data.message || JSON.stringify(data);
        } else {
            // If not JSON, treat as plain text
            return await response.text();
        }
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        }

        if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please ensure the backend is running on http://localhost:8080');
        }

        throw error;
    }
}

// ========================================
// Message Handling
// ========================================
async function handleSendMessage() {
    const message = elements.messageInput.value.trim();

    if (!message || state.isLoading) {
        return;
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    elements.messageInput.value = '';
    autoResizeTextarea();

    // Show loading state
    setLoading(true);
    showTypingIndicator();

    try {
        // Send to API
        const response = await sendMessageToAPI(message);

        // Hide typing indicator
        hideTypingIndicator();

        // Add bot response
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);

        hideTypingIndicator();

        // Show error message
        addMessage(
            `Sorry, I encountered an error: ${error.message}. Please try again.`,
            'bot'
        );
    } finally {
        setLoading(false);
        elements.messageInput.focus();
    }
}

function clearChat() {
    // Clear messages array
    state.messages = [];

    // Clear UI
    elements.messagesWrapper.innerHTML = '';

    // Show welcome section again
    const welcomeSection = document.createElement('div');
    welcomeSection.className = 'welcome-section';
    welcomeSection.innerHTML = `
        <div class="welcome-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" fill="url(#welcomeGradient)"/>
                <path d="M32 16v20M32 42v2" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <defs>
                    <linearGradient id="welcomeGradient" x1="4" y1="4" x2="60" y2="60">
                        <stop stop-color="#667eea"/>
                        <stop offset="1" stop-color="#764ba2"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <h2>Welcome to AI Assistant</h2>
        <p>Ask me anything! I'm here to help you with your questions.</p>
        <div class="suggestion-chips">
            <button class="chip" data-prompt="What can you help me with?">What can you help me with?</button>
            <button class="chip" data-prompt="Tell me a fun fact">Tell me a fun fact</button>
            <button class="chip" data-prompt="Help me brainstorm ideas">Help me brainstorm ideas</button>
        </div>
    `;

    elements.messagesWrapper.appendChild(welcomeSection);

    // Re-attach event listeners to new chips
    attachChipListeners();
}

// ========================================
// Event Listeners
// ========================================
function attachChipListeners() {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            elements.messageInput.value = prompt;
            handleSendMessage();
        });
    });
}

function initEventListeners() {
    // Send button
    elements.sendButton.addEventListener('click', handleSendMessage);

    // Clear button
    elements.clearButton.addEventListener('click', () => {
        if (state.messages.length > 0) {
            if (confirm('Are you sure you want to clear the chat history?')) {
                clearChat();
            }
        }
    });

    // Input textarea
    elements.messageInput.addEventListener('input', autoResizeTextarea);

    elements.messageInput.addEventListener('keydown', (e) => {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Focus input on load
    elements.messageInput.focus();

    // Suggestion chips
    attachChipListeners();
}

// ========================================
// Initialization
// ========================================
function init() {
    console.log('AI Chat Assistant initialized');
    console.log('Backend URL:', API_CONFIG.baseURL + API_CONFIG.endpoint);

    initEventListeners();

    // Add fade-in animation to styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
