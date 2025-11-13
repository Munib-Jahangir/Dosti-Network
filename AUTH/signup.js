// Import Firebase modules
import { auth, createUserWithEmailAndPassword, createUserDocument } from './config.js';

// Get DOM elements
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Add submit event listener to the form
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get input values
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showError('Password must be at least 6 characters long!');
        return;
    }
    
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save additional user data to Firestore using the helper function
        await createUserDocument(user, { name });
        
        // Show success message
        showSuccess('Account created successfully! Redirecting to dashboard...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = '../Main/Dashboard/Dashboard.html';
        }, 2000);
    } catch (error) {
        // Handle errors
        const errorCode = error.code;
        const errorMessageText = error.message;
        
        // Display error message
        if (errorCode === 'auth/email-already-in-use') {
            showError('This email is already registered. Please login instead.');
        } else if (errorCode === 'auth/invalid-email') {
            showError('Invalid email address. Please check and try again.');
        } else {
            showError('Signup failed. Please try again.');
        }
        
        console.error('Signup error:', errorCode, errorMessageText);
    }
});

// Helper functions for showing messages
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}