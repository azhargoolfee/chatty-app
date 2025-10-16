// Chat functionality
let connection = null;

function showChat() {
    if (!app.isAuthenticated) {
        showNotification('Please login to access the chat room.', 'error');
        showLogin();
        return;
    }

    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-primary text-white px-6 py-4">
                    <h4 class="text-xl font-bold">
                        <i class="fas fa-comments mr-2"></i>
                        Chat Room - Welcome ${app.currentUser?.email || 'User'}
                    </h4>
                </div>
                
                <!-- Chat messages area -->
                <div id="messagesArea" class="h-96 overflow-y-auto bg-gray-50 p-4 border-b border-gray-200">
                    <div id="messagesList" class="space-y-3">
                        <div class="text-center text-gray-500 py-4">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            Loading messages...
                        </div>
                    </div>
                </div>
                
                <!-- Message input area -->
                <div class="p-4 bg-white">
                    <div class="flex space-x-3">
                        <input type="text" id="messageInput" 
                               class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                               placeholder="Type your message..." 
                               maxlength="500"
                               onkeypress="handleMessageKeypress(event)" />
                        <button id="sendButton" type="button" onclick="sendMessage()"
                                class="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition flex items-center space-x-2">
                            <i class="fas fa-paper-plane"></i>
                            <span>Send</span>
                        </button>
                    </div>
                    <small class="text-gray-500 text-sm mt-2 block">Press Enter to send</small>
                </div>
            </div>
        </div>
    `;

    // Initialize chat after the HTML is loaded
    initializeChat();
}

async function initializeChat() {
    // Load recent messages
    await loadRecentMessages();
    
    // Initialize SignalR connection
    await initializeSignalR();
}

async function loadRecentMessages() {
    try {
        const response = await fetch('/api/chat/messages', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const messages = await response.json();
            displayMessages(messages);
        } else {
            console.error('Failed to load messages');
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    messages.forEach(message => {
        addMessageToUI(message.userName, message.content, formatTime(message.timestamp));
    });
    
    scrollToBottom();
}

async function initializeSignalR() {
    try {
        // Create connection to SignalR hub
        connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        // Listen for incoming messages
        connection.on("ReceiveMessage", function (userName, message, timestamp) {
            addMessageToUI(userName, message, timestamp);
            scrollToBottom();
        });

        // Start the connection
        await connection.start();
        console.log("Connected to chat hub");
        
    } catch (error) {
        console.error("SignalR connection failed:", error);
        showNotification('Failed to connect to chat. Please try again.', 'error');
    }
}

function addMessageToUI(userName, message, timestamp) {
    const messagesList = document.getElementById('messagesList');
    
    const messageDiv = document.createElement("div");
    messageDiv.className = "message-item bg-white rounded-lg p-4 shadow-sm border-l-4 border-primary";
    
    const headerDiv = document.createElement("div");
    headerDiv.className = "flex justify-between items-start mb-2";
    
    const userSpan = document.createElement("strong");
    userSpan.className = "text-primary font-semibold";
    userSpan.textContent = userName + ":";
    
    const timeSpan = document.createElement("small");
    timeSpan.className = "text-gray-500 text-sm";
    timeSpan.textContent = timestamp;
    
    headerDiv.appendChild(userSpan);
    headerDiv.appendChild(timeSpan);
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content text-gray-800";
    contentDiv.textContent = message;
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);
    
    messagesList.appendChild(messageDiv);
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    if (!connection) {
        showNotification('Chat connection not established. Please try again.', 'error');
        return;
    }
    
    try {
        await connection.invoke("SendMessage", message);
        messageInput.value = "";
    } catch (error) {
        console.error("Error sending message:", error);
        showNotification('Failed to send message. Please try again.', 'error');
    }
}

function handleMessageKeypress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function scrollToBottom() {
    const messagesArea = document.getElementById("messagesArea");
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}