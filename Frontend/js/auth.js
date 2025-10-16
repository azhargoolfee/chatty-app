// Authentication functions

function showLogin() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white">
                        <i class="fas fa-sign-in-alt text-xl"></i>
                    </div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Or
                        <button onclick="showRegister()" class="font-medium text-primary hover:text-blue-600 transition">
                            create a new account
                        </button>
                    </p>
                </div>
                <form id="loginForm" class="mt-8 space-y-6" onsubmit="handleLogin(event)">
                    <div id="loginError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm hidden"></div>
                    
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label for="loginEmail" class="sr-only">Email address</label>
                            <input id="loginEmail" name="email" type="email" autocomplete="email" required 
                                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                                   placeholder="Email address">
                        </div>
                        <div>
                            <label for="loginPassword" class="sr-only">Password</label>
                            <input id="loginPassword" name="password" type="password" autocomplete="current-password" required 
                                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                                   placeholder="Password">
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="rememberMe" name="rememberMe" type="checkbox" 
                                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                            <label for="rememberMe" class="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <i class="fas fa-lock text-blue-500 group-hover:text-blue-400"></i>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function showRegister() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white">
                        <i class="fas fa-user-plus text-xl"></i>
                    </div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Or
                        <button onclick="showLogin()" class="font-medium text-primary hover:text-blue-600 transition">
                            sign in to your existing account
                        </button>
                    </p>
                </div>
                <form id="registerForm" class="mt-8 space-y-6" onsubmit="handleRegister(event)">
                    <div id="registerError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm hidden"></div>
                    
                    <div class="space-y-4">
                        <div>
                            <label for="registerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input id="registerEmail" name="email" type="email" autocomplete="email" required 
                                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                   placeholder="Enter your email">
                        </div>
                        
                        <div>
                            <label for="registerPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input id="registerPassword" name="password" type="password" autocomplete="new-password" required 
                                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                   placeholder="Create a password">
                        </div>
                        
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" required 
                                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                   placeholder="Confirm your password">
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <i class="fas fa-user-plus text-blue-500 group-hover:text-blue-400"></i>
                            </span>
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        const response = await fetch('/api/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
                rememberMe
            })
        });

        if (response.ok) {
            const result = await response.json();
            app.currentUser = result.user;
            app.isAuthenticated = true;
            updateNavigation();
            showNotification('Login successful!', 'success');
            showHome();
        } else {
            const error = await response.json();
            showLoginError(error.message || 'Invalid login attempt.');
        }
    } catch (error) {
        showLoginError('Login failed. Please try again.');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showRegisterError('Passwords do not match.');
        return;
    }
    
    try {
        const response = await fetch('/api/account/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
                confirmPassword
            })
        });

        if (response.ok) {
            const result = await response.json();
            app.currentUser = result.user;
            app.isAuthenticated = true;
            updateNavigation();
            showNotification('Registration successful!', 'success');
            showHome();
        } else {
            const error = await response.json();
            showRegisterError(error.message || 'Registration failed.');
        }
    } catch (error) {
        showRegisterError('Registration failed. Please try again.');
    }
}

async function logout() {
    try {
        const response = await fetch('/api/account/logout', {
            method: 'POST',
            credentials: 'include'
        });

        app.currentUser = null;
        app.isAuthenticated = false;
        updateNavigation();
        showNotification('Logged out successfully!', 'success');
        showHome();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showRegisterError(message) {
    const errorDiv = document.getElementById('registerError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}