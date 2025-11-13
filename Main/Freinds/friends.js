// Import Firebase modules
import { auth, db, getAllUsers, getUserData } from '../../AUTH/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Get DOM elements
const userNameElement = document.getElementById('user-name');
const friendsContainer = document.getElementById('friends-container');
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
        
        // Fetch user data from Firestore
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userNameElement.textContent = userData.name || 'User';
                
                // Load friends only
                loadFriends(userData);
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

// Function to load friends only
async function loadFriends(userData) {
    try {
        // Check if user has friends
        if (!userData.friends || userData.friends.length === 0) {
            friendsContainer.innerHTML = '<div class="no-friends">You have no friends yet. Visit "Add Friend" to find friends!</div>';
            return;
        }
        
        // Display friends
        let friendsHTML = '';
        
        // For each friend ID, fetch their data
        for (const friendId of userData.friends) {
            try {
                const friendDoc = await getDoc(doc(db, "users", friendId));
                
                if (friendDoc.exists()) {
                    const friendData = friendDoc.data();
                    
                    // Get first letter of friend's name for avatar
                    const firstLetter = friendData.name ? friendData.name.charAt(0).toUpperCase() : '?';
                    
                    friendsHTML += `
                        <div class="friend-card" data-friend-id="${friendId}">
                            <div class="friend-avatar">${firstLetter}</div>
                            <h3 class="friend-name">${friendData.name || 'Unknown User'}</h3>
                            <p class="friend-email">${friendData.email}</p>
                            <div class="friend-id">ID: ${friendId}</div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error(`Error fetching friend data for ${friendId}:`, error);
            }
        }
        
        friendsContainer.innerHTML = friendsHTML;
    } catch (error) {
        console.error("Error loading friends list:", error);
        friendsContainer.innerHTML = '<div class="no-friends">Error loading friends list. Please try again.</div>';
    }
}

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