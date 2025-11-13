// Import Firebase modules
import { auth, db } from '../../AUTH/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Get DOM elements
const userNameElement = document.getElementById('user-name');
const userIdElement = document.getElementById('user-id');
const profileForm = document.getElementById('profile-form');
const logoutBtn = document.getElementById('logout-btn');

// Create custom popup element
function createCustomPopup(message, isSuccess = true) {
    // Remove any existing popup
    const existingPopup = document.getElementById('custom-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.id = 'custom-popup';
    popup.innerHTML = `
        <div class="popup-content ${isSuccess ? 'success' : 'error'}">
            <p>${message}</p>
            <button class="close-popup">&times;</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #custom-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .popup-content {
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 300px;
            width: 80%;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        .popup-content.success {
            background: linear-gradient(135deg, #1e723c, #2a9852);
        }
        
        .popup-content.error {
            background: linear-gradient(135deg, #721e1e, #982a2a);
        }
        
        .popup-content p {
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        
        .close-popup {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .close-popup:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(popup);
    
    // Add event listener to close button
    popup.querySelector('.close-popup').addEventListener('click', () => {
        popup.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 3000);
}

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        const uid = user.uid;
        
        // Display user ID
        userIdElement.textContent = uid;
        
        // Fetch user data from Firestore
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userNameElement.textContent = userData.name || 'User';
            } else {
                console.log("No such document!");
                userNameElement.textContent = 'User';
            }
        } catch (error) {
            console.error("Error getting user document:", error);
            userNameElement.textContent = 'User';
        }
    } else {
        // User is signed out
        window.location.href = '../../AUTH/login.html';
    }
});

// Handle profile form submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show "Coming Soon" message
    createCustomPopup('Profile customization is coming soon!');
});

// Handle logout
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default behavior
    try {
        await signOut(auth);
        window.location.href = '../../AUTH/login.html';
    } catch (error) {
        console.error("Error signing out:", error);
        createCustomPopup('Failed to logout. Please try again.', false);
    }
});