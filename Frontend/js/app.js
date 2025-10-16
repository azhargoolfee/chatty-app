// Global application state
const app = {
    currentUser: null,
    isAuthenticated: false,
    apiBase: 'http://localhost:5026/api'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    showHome();
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/account/profile', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            app.currentUser = user;
            app.isAuthenticated = true;
            updateNavigation();
        } else {
            app.isAuthenticated = false;
            updateNavigation();
        }
    } catch (error) {
        console.log('Not authenticated');
        app.isAuthenticated = false;
        updateNavigation();
    }
}

// Update navigation based on auth status
function updateNavigation() {
    const navAuth = document.getElementById('navAuth');
    const chatLink = document.getElementById('chatLink');
    
    if (app.isAuthenticated) {
        chatLink.classList.remove('hidden');
        navAuth.innerHTML = `
            <span class="text-gray-700 text-sm">Hello, ${app.currentUser?.email || 'User'}!</span>
            <button onclick="logout()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition">
                <i class="fas fa-sign-out-alt mr-1"></i> Logout
            </button>
        `;
    } else {
        chatLink.classList.add('hidden');
        navAuth.innerHTML = `
            <button onclick="showLogin()" class="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition">Login</button>
            <button onclick="showRegister()" class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition">Register</button>
        `;
    }
}

// Navigation functions
function showHome() {
    const mainContent = document.getElementById('mainContent');
    
    if (app.isAuthenticated) {
        mainContent.innerHTML = `
            <div class="text-center py-12">
                <h1 class="text-5xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-comments text-primary mr-4"></i>
                    Welcome Back!
                </h1>
                <p class="text-xl text-gray-600 mb-8">Ready to chat with the community?</p>
                
                <div class="mb-12">
                    <p class="text-gray-600 mb-6">Welcome back, ${app.currentUser?.email || 'User'}! Ready to chat?</p>
                    <button onclick="showChat()" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition shadow-md">
                        <i class="fas fa-comments mr-2"></i> Go to Chat Room
                    </button>
                </div>
            </div>
        `;
    } else {
        mainContent.innerHTML = `
            <div class="text-center py-12">
                <h1 class="text-5xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-comments text-primary mr-4"></i>
                    Welcome to Chatty
                </h1>
                <p class="text-xl text-gray-600 mb-8">Connect with others in real-time chat!</p>
                
                <div class="mb-12">
                    <p class="text-gray-600 mb-6">Join the conversation by signing in or creating an account.</p>
                    <div class="flex justify-center space-x-4">
                        <button onclick="showLogin()" class="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition shadow-md">
                            <i class="fas fa-sign-in-alt mr-2"></i> Sign In
                        </button>
                        <button onclick="showRegister()" class="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition">
                            <i class="fas fa-user-plus mr-2"></i> Register
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mt-16">
                <div class="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
                    <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-bolt text-3xl text-yellow-500"></i>
                    </div>
                    <h5 class="text-xl font-bold text-gray-900 mb-4">Real-time Messaging</h5>
                    <p class="text-gray-600">Chat instantly with other users using our real-time messaging system powered by SignalR.</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-shield-alt text-3xl text-green-500"></i>
                    </div>
                    <h5 class="text-xl font-bold text-gray-900 mb-4">Secure Authentication</h5>
                    <p class="text-gray-600">Your conversations are protected with secure user authentication and authorization.</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-users text-3xl text-blue-500"></i>
                    </div>
                    <h5 class="text-xl font-bold text-gray-900 mb-4">Community Chat</h5>
                    <p class="text-gray-600">Join a welcoming community where everyone can share thoughts and engage in conversations.</p>
                </div>
            </div>
        `;
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg text-white z-50 ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}