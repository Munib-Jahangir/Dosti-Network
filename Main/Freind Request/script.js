// Import Firebase modules
import { auth, db, getUserData } from '../../AUTH/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Get DOM elements
const userNameElement = document.getElementById('user-name');
const requestsContainer = document.getElementById('requests-container');
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
                
                // Load friend requests
                loadFriendRequests(uid);
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

// Function to load friend requests
async function loadFriendRequests(userId) {
    try {
        // Get current user data to access friendRequests array
        const userDoc = await getDoc(doc(db, "users", userId));
        
        if (!userDoc.exists()) {
            requestsContainer.innerHTML = '<div class="no-requests">Error loading friend requests.</div>';
            return;
        }
        
        const userData = userDoc.data();
        const friendRequests = userData.friendRequests || [];
        
        if (friendRequests.length === 0) {
            requestsContainer.innerHTML = '<div class="no-requests">No friend requests at this time.</div>';
            return;
        }
        
        // Display requests
        let requestsHTML = '';
        
        // For each requester ID, fetch their user data
        for (const requesterId of friendRequests) {
            try {
                const requesterDoc = await getDoc(doc(db, "users", requesterId));
                
                if (requesterDoc.exists()) {
                    const requesterData = requesterDoc.data();
                    
                    requestsHTML += `
                        <div class="request-item" data-requester-id="${requesterId}">
                            <div class="user-info-container">
                                <h3>${requesterData.name || 'Unknown User'}</h3>
                                <p>Email: ${requesterData.email}</p>
                                <p>User ID: ${requesterData.uid}</p>
                            </div>
                            <div class="actions-container">
                                <button class="accept-btn" data-requester-id="${requesterId}">Accept</button>
                                <button class="decline-btn" data-requester-id="${requesterId}">Decline</button>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error(`Error fetching requester data for ${requesterId}:`, error);
            }
        }
        
        requestsContainer.innerHTML = requestsHTML;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', handleAcceptRequest);
        });
        
        document.querySelectorAll('.decline-btn').forEach(button => {
            button.addEventListener('click', handleDeclineRequest);
        });
    } catch (error) {
        console.error("Error loading friend requests:", error);
        requestsContainer.innerHTML = '<div class="no-requests">Error loading friend requests. Please try again.</div>';
    }
}

// Function to handle accepting a friend request
async function handleAcceptRequest(e) {
    const button = e.target;
    const requesterId = button.getAttribute('data-requester-id');
    const currentUserId = auth.currentUser.uid;
    
    // Disable buttons to prevent multiple clicks
    const requestItem = button.closest('.request-item');
    const acceptBtn = requestItem.querySelector('.accept-btn');
    const declineBtn = requestItem.querySelector('.decline-btn');
    
    acceptBtn.disabled = true;
    declineBtn.disabled = true;
    acceptBtn.textContent = 'Accepting...';
    
    try {
        // Add each user to the other's friends list
        // Add requester to current user's friends
        await updateDoc(doc(db, "users", currentUserId), {
            friends: arrayUnion(requesterId),
            friendRequests: arrayRemove(requesterId)
        });
        
        // Add current user to requester's friends
        await updateDoc(doc(db, "users", requesterId), {
            friends: arrayUnion(currentUserId),
            sentRequests: arrayRemove(currentUserId)
        });
        
        // Remove the request item from the UI
        requestItem.remove();
        
        // Show success message with custom popup
        createCustomPopup('Friend request accepted!');
        
        // Check if there are any requests left
        if (requestsContainer.children.length === 0) {
            requestsContainer.innerHTML = '<div class="no-requests">No friend requests at this time.</div>';
        }
    } catch (error) {
        console.error("Error accepting friend request:", error);
        acceptBtn.disabled = false;
        declineBtn.disabled = false;
        acceptBtn.textContent = 'Accept';
        createCustomPopup('Failed to accept friend request. Please try again.', false);
    }
}

// Function to handle declining a friend request
async function handleDeclineRequest(e) {
    const button = e.target;
    const requesterId = button.getAttribute('data-requester-id');
    const currentUserId = auth.currentUser.uid;
    
    // Disable buttons to prevent multiple clicks
    const requestItem = button.closest('.request-item');
    const acceptBtn = requestItem.querySelector('.accept-btn');
    const declineBtn = requestItem.querySelector('.decline-btn');
    
    declineBtn.disabled = true;
    acceptBtn.disabled = true;
    declineBtn.textContent = 'Declining...';
    
    try {
        // Remove requester from current user's friendRequests
        await updateDoc(doc(db, "users", currentUserId), {
            friendRequests: arrayRemove(requesterId)
        });
        
        // Remove current user from requester's sentRequests
        await updateDoc(doc(db, "users", requesterId), {
            sentRequests: arrayRemove(currentUserId)
        });
        
        // Remove the request item from the UI
        requestItem.remove();
        
        // Show success message with custom popup
        createCustomPopup('Friend request declined.');
        
        // Check if there are any requests left
        if (requestsContainer.children.length === 0) {
            requestsContainer.innerHTML = '<div class="no-requests">No friend requests at this time.</div>';
        }
    } catch (error) {
        console.error("Error declining friend request:", error);
        acceptBtn.disabled = false;
        declineBtn.disabled = false;
        declineBtn.textContent = 'Decline';
        createCustomPopup('Failed to decline friend request. Please try again.', false);
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