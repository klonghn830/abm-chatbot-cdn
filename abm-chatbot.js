<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABM AI Chat Bot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .chat-container {
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .chat-header {
            background: linear-gradient(135deg, #dc143c 0%, #b91c3c 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }

        .chat-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }

        .brand-logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 5px;
            position: relative;
            z-index: 1;
        }

        .chat-subtitle {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            position: relative;
            z-index: 1;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #00ff88;
            border-radius: 50%;
            margin-right: 5px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }

        .message {
            margin-bottom: 15px;
            animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.bot {
            text-align: left;
        }

        .message.user {
            text-align: right;
        }

        .message-bubble {
            display: inline-block;
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        .message.bot .message-bubble {
            background: white;
            color: #333;
            border-bottom-left-radius: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .message.user .message-bubble {
            background: linear-gradient(135deg, #dc143c 0%, #b91c3c 100%);
            color: white;
            border-bottom-right-radius: 5px;
        }

        .welcome-screen {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .welcome-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .welcome-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #dc143c;
        }

        .welcome-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
            line-height: 1.5;
        }

        .get-started-btn {
            background: linear-gradient(135deg, #dc143c 0%, #b91c3c 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .get-started-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220, 20, 60, 0.4);
        }

        .chat-input-container {
            padding: 20px;
            background: white;
            border-top: 1px solid #eee;
        }

        .chat-input-wrapper {
            display: flex;
            align-items: center;
            background: #f8f9fa;
            border-radius: 25px;
            padding: 5px;
        }

        .chat-input {
            flex: 1;
            border: none;
            outline: none;
            padding: 12px 16px;
            background: transparent;
            font-size: 14px;
        }

        .chat-input::placeholder {
            color: #999;
        }

        .send-btn {
            background: linear-gradient(135deg, #dc143c 0%, #b91c3c 100%);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .send-btn:hover {
            transform: scale(1.1);
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .typing-indicator {
            display: none;
            text-align: left;
            margin-bottom: 15px;
        }

        .typing-indicator .message-bubble {
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .typing-dots {
            display: flex;
            gap: 3px;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: #dc143c;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }

        .chat-footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #999;
            background: #f8f9fa;
        }

        /* Scrollbar styling */
        .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .chat-messages::-webkit-scrollbar-thumb {
            background: #dc143c;
            border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
            background: #b91c3c;
        }
    </style>
</head>
<body>
    <div class="chat-container" id="n8n-chat">
        <div class="chat-header">
            <div class="brand-logo">ABM A.I</div>
            <div class="chat-subtitle">Trợ lý thông minh của bạn</div>
            <div class="status-indicator">
                <div class="status-dot"></div>
                <span style="font-size: 12px;">Đang hoạt động</span>
            </div>
        </div>

        <div class="chat-messages" id="chatMessages">
            <div class="welcome-screen" id="welcomeScreen">
                <div class="welcome-icon">🤖</div>
                <div class="welcome-title">Xin chào! 👋</div>
                <div class="welcome-subtitle">Tôi là ABM AI, trợ lý thông minh của bạn. Hãy bắt đầu cuộc trò chuyện để tôi có thể hỗ trợ bạn 24/7.</div>
                <button class="get-started-btn" onclick="startNewChat()">Bắt đầu trò chuyện</button>
            </div>
            
            <div class="typing-indicator" id="typingIndicator">
                <div class="message-bubble">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="chat-input-container">
            <div class="chat-input-wrapper">
                <input 
                    type="text" 
                    class="chat-input" 
                    id="chatInput" 
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled
                >
                <button class="send-btn" id="sendBtn" onclick="sendMessage()" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="chat-footer">
            Powered by ABM Technology
        </div>
    </div>

    <script>
        // Chat configuration
        const chatConfig = {
            webhookUrl: 'https://your-n8n-webhook-url.com/webhook/chat',
            webhookConfig: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true,
            metadata: {
                brand: 'ABM',
                version: '1.0'
            },
            showWelcomeScreen: false,
            defaultLanguage: 'vi',
            initialMessages: [
                'Xin chào! 👋',
                'Tôi là ABM AI. Tôi có thể hỗ trợ bạn như thế nào hôm nay?'
            ],
            i18n: {
                vi: {
                    title: 'Xin chào! 👋',
                    subtitle: "Bắt đầu trò chuyện. Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.",
                    footer: 'Powered by ABM Technology',
                    getStarted: 'Bắt đầu trò chuyện',
                    inputPlaceholder: 'Nhập câu hỏi của bạn...',
                },
            },
            enableStreaming: false,
        };

        // Global variables
        let sessionId = generateSessionId();
        let messageHistory = [];
        let isWaitingResponse = false;

        // Generate session ID
        function generateSessionId() {
            return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        }

        // Start new chat
        function startNewChat() {
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('chatInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            
            // Add initial messages
            setTimeout(() => {
                addBotMessage(chatConfig.initialMessages[0]);
                setTimeout(() => {
                    addBotMessage(chatConfig.initialMessages[1]);
                }, 1000);
            }, 500);
            
            // Focus on input
            document.getElementById('chatInput').focus();
        }

        // Add message to chat
        function addMessage(content, isBot = false) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isBot ? 'bot' : 'user'}`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            bubbleDiv.textContent = content;
            
            messageDiv.appendChild(bubbleDiv);
            messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Save to history
            messageHistory.push({
                content: content,
                isBot: isBot,
                timestamp: new Date().toISOString()
            });
        }

        // Add bot message with typing effect
        function addBotMessage(content) {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                addMessage(content, true);
            }, Math.random() * 1000 + 500);
        }

        // Show typing indicator
        function showTypingIndicator() {
            document.getElementById('typingIndicator').style.display = 'block';
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            document.getElementById('typingIndicator').style.display = 'none';
        }

        // Send message
        async function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (!message || isWaitingResponse) return;
            
            // Add user message
            addMessage(message, false);
            input.value = '';
            
            // Disable input while waiting
            isWaitingResponse = true;
            document.getElementById('sendBtn').disabled = true;
            
            try {
                // Send to webhook
                const response = await fetch(chatConfig.webhookUrl, {
                    method: chatConfig.webhookConfig.method,
                    headers: chatConfig.webhookConfig.headers,
                    body: JSON.stringify({
                        [chatConfig.chatInputKey]: message,
                        [chatConfig.chatSessionKey]: sessionId,
                        metadata: chatConfig.metadata,
                        history: messageHistory.slice(-10) // Send last 10 messages
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const botResponse = data.response || data.message || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';
                    addBotMessage(botResponse);
                } else {
                    addBotMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                addBotMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
            } finally {
                // Re-enable input
                isWaitingResponse = false;
                document.getElementById('sendBtn').disabled = false;
                input.focus();
            }
        }

        // Handle Enter key
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Handle input changes
        document.getElementById('chatInput').addEventListener('input', function() {
            const sendBtn = document.getElementById('sendBtn');
            const hasText = this.value.trim().length > 0;
            sendBtn.disabled = !hasText || isWaitingResponse;
        });

        // Initialize chat function (compatible with your template)
        function createChat(config) {
            // Merge config with default
            Object.assign(chatConfig, config);
            
            // Update UI based on config
            if (config.i18n && config.i18n[config.defaultLanguage]) {
                const lang = config.i18n[config.defaultLanguage];
                document.querySelector('.welcome-title').textContent = lang.title;
                document.querySelector('.welcome-subtitle').textContent = lang.subtitle;
                document.querySelector('.get-started-btn').textContent = lang.getStarted;
                document.querySelector('.chat-input').placeholder = lang.inputPlaceholder;
                if (lang.footer) {
                    document.querySelector('.chat-footer').textContent = lang.footer;
                }
            }
            
            // Auto-start if showWelcomeScreen is false
            if (!config.showWelcomeScreen) {
                startNewChat();
            }
            
            console.log('ABM Chat initialized with config:', chatConfig);
        }

        // Example usage (uncomment and modify webhook URL)
        /*
        createChat({
            webhookUrl: 'https://your-n8n-instance.com/webhook/abm-chat',
            webhookConfig: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your-token'
                }
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true,
            metadata: {
                brand: 'ABM',
                version: '1.0'
            },
            showWelcomeScreen: false,
            defaultLanguage: 'vi',
            initialMessages: [
                'Xin chào! 👋',
                'Tôi là ABM AI. Tôi có thể hỗ trợ bạn như thế nào hôm nay?'
            ],
            i18n: {
                vi: {
                    title: 'Xin chào! 👋',
                    subtitle: "Bắt đầu trò chuyện. Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.",
                    footer: 'Powered by ABM Technology',
                    getStarted: 'Bắt đầu trò chuyện',
                    inputPlaceholder: 'Nhập câu hỏi của bạn...',
                },
            },
            enableStreaming: false,
        });
        */
    </script>
</body>
</html>
