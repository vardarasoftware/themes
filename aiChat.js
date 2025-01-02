class ChatInterface {
    constructor() {
        try {
            this.input = document.querySelector('#chat-input');
            this.sendButton = document.querySelector('#send-button');
            this.chatMessages = document.querySelector('#chat-messages');
            
            if (!this.input || !this.sendButton || !this.chatMessages) {
                throw new Error('Required elements not found');
            }

            console.log('ChatInterface initialized successfully');
            this.initializeEventListeners();
        } catch (error) {
            console.error('Error initializing ChatInterface:', error);
        }
    }

    initializeEventListeners = () => {
        try {
            this.sendButton.addEventListener('click', this.handleSend);
            this.input.addEventListener('keypress', this.handleKeyPress);
            console.log('Event listeners initialized');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSend();
        }
    }

    addMessage = (message, isUser = false) => {
        const messageTemplate = `
            <div class="flex items-start message-animation ${isUser ? 'justify-end space-x-2' : 'space-x-2'}">
                ${!isUser ? this.getAIAvatarTemplate() : ''}
                <div class="${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} 
                            rounded-lg p-3 max-w-[80%] message-bubble">
                    <p>${message}</p>
                </div>
                ${isUser ? this.getUserAvatarTemplate() : ''}
            </div>
        `;

        this.chatMessages?.insertAdjacentHTML('beforeend', messageTemplate);
        this.scrollToBottom();
    }

    getAIAvatarTemplate = () => `
        <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ai-avatar">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2" class="opacity-50"/>
                <path d="M12 8 L15 12 L9 16" stroke-width="2"/>
            </svg>
        </div>
    `

    getUserAvatarTemplate = () => `
        <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    `

    scrollToBottom = () => {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    showTypingIndicator = () => {
        const typingTemplate = `
            <div class="flex items-start space-x-2 typing-indicator">
                ${this.getAIAvatarTemplate()}
                <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p class="text-gray-500">
                        <span>•</span>
                        <span>•</span>
                        <span>•</span>
                    </p>
                </div>
            </div>
        `;
        this.chatMessages?.insertAdjacentHTML('beforeend', typingTemplate);
        this.scrollToBottom();
    }

    removeTypingIndicator = () => {
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator?.remove();
    }

    simulateAIResponse = async (message) => {
        this.showTypingIndicator();
        
        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.removeTypingIndicator();
        this.addMessage(this.getAIResponse(message));
    }

    getAIResponse = (userMessage) => {
        // Simple response logic - can be expanded
        const responses = [
            "I understand. Let me help you with that.",
            "That's interesting. Could you tell me more?",
            "I'm processing your request. Here's what I think...",
            "Based on what you've said, I suggest..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleSend = () => {
        try {
            const message = this.input?.value.trim();
            if (message) {
                this.sendButton.disabled = true;
                this.sendButton.classList.add('opacity-50');
                
                this.addMessage(message, true);
                this.input.value = '';
                
                this.simulateAIResponse(message)
                    .finally(() => {
                        this.sendButton.disabled = false;
                        this.sendButton.classList.remove('opacity-50');
                    });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.sendButton.disabled = false;
            this.sendButton.classList.remove('opacity-50');
        }
    }
}

export default ChatInterface; 