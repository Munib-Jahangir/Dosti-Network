// Import Firebase modules
import { auth, db } from '../../AUTH/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Get DOM elements
const userNameElement = document.getElementById('user-name');
const profileNameElement = document.getElementById('profile-name');
const profileEmailElement = document.getElementById('profile-email');
const userIdElement = document.getElementById('user-id');
const profileAvatarElement = document.getElementById('profile-avatar');
const displayNameInput = document.getElementById('display-name');
const bioInput = document.getElementById('bio');
const phoneInput = document.getElementById('phone');
const locationInput = document.getElementById('location');
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
                
                // Update UI with user data
                userNameElement.textContent = userData.name || 'User';
                profileNameElement.textContent = userData.name || 'User';
                profileEmailElement.textContent = userData.email || 'No email provided';
                
                // Set avatar with first letter of name
                const firstLetter = userData.name ? userData.name.charAt(0).toUpperCase() : '?';
                profileAvatarElement.textContent = firstLetter;
                
                // Pre-fill profile form if data exists
                if (userData.displayName) {
                    displayNameInput.value = userData.displayName;
                }
                
                if (userData.bio) {
                    bioInput.value = userData.bio;
                }
                
                if (userData.phone) {
                    phoneInput.value = userData.phone;
                }
                
                if (userData.location) {
                    locationInput.value = userData.location;
                }
            } else {
                console.log("No such document!");
                userNameElement.textContent = 'User';
                profileNameElement.textContent = 'User';
                profileEmailElement.textContent = 'No email provided';
                profileAvatarElement.textContent = '?';
            }
        } catch (error) {
            console.error("Error getting user document:", error);
            userNameElement.textContent = 'User';
            profileNameElement.textContent = 'User';
            profileEmailElement.textContent = 'No email provided';
            profileAvatarElement.textContent = '?';
        }
    } else {
        // User is signed out
        window.location.href = '../../AUTH/login.html';
    }
});

// Handle profile form submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;
    
    const displayName = displayNameInput.value;
    const bio = bioInput.value;
    const phone = phoneInput.value;
    const location = locationInput.value;
    
    try {
        // Update user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: profileNameElement.textContent,
            email: profileEmailElement.textContent,
            displayName: displayName,
            bio: bio,
            phone: phone,
            location: location,
            updatedAt: new Date()
        }, { merge: true }); // Merge with existing data
        
        // Show success message
        createCustomPopup('Profile updated successfully!');
    } catch (error) {
        console.error("Error updating profile:", error);
        createCustomPopup('Failed to update profile. Please try again.', false);
    }
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