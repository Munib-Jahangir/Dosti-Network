// Import Firebase modules
import { auth } from './config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Get DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Add submit event listener to the form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get input values
    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Show success message
        console.log('Login successful:', user);
        
        // Redirect to dashboard
        window.location.href = '../Main/Dashboard/Dashboard.html';
    } catch (error) {
        // Handle errors
        const errorCode = error.code;
        const errorMessageText = error.message;
        
        // Display error message
        errorMessage.style.display = 'block';
        if (errorCode === 'auth/user-not-found') {
            errorMessage.textContent = 'No account found with this email. Please sign up first.';
        } else if (errorCode === 'auth/wrong-password') {
            errorMessage.textContent = 'Incorrect password. Please try again.';
        } else {
            errorMessage.textContent = 'Login failed. Please try again.';
        }
        
        console.error('Login error:', errorCode, errorMessageText);
    }
});