// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLSe1HnVI3KZj60fm7gPwL7h7aE_h4Kkc",
  authDomain: "dosti-network.firebaseapp.com",
  projectId: "dosti-network",
  storageBucket: "dosti-network.firebasestorage.app",
  messagingSenderId: "613588709529",
  appId: "1:613588709529:web:cf8bdd74917ee6fa39c808",
  measurementId: "G-Q10TXRRH2R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Helper functions for user management
async function createUserDocument(user, additionalData) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: additionalData.name || "",
      createdAt: new Date(),
      friends: [],
      friendRequests: [],
      sentRequests: [],
    });
  } catch (error) {
    console.error("Error creating user document:", error);
  }
}

async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}

// Function to get user data by ID
async function getUserDataById(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data by ID:", error);
    return null;
  }
}

async function sendFriendRequest(senderUid, receiverUid) {
  try {
    // Add receiver to sender's sentRequests
    await updateDoc(doc(db, "users", senderUid), {
      sentRequests: arrayUnion(receiverUid),
    });
    
    // Add sender to receiver's friendRequests
    await updateDoc(doc(db, "users", receiverUid), {
      friendRequests: arrayUnion(senderUid),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { success: false, error };
  }
}

async function acceptFriendRequest(userUid, requesterUid) {
  try {
    // Add each other to friends lists
    await updateDoc(doc(db, "users", userUid), {
      friends: arrayUnion(requesterUid),
      friendRequests: arrayRemove(requesterUid),
    });
    
    await updateDoc(doc(db, "users", requesterUid), {
      friends: arrayUnion(userUid),
      sentRequests: arrayRemove(userUid),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { success: false, error };
  }
}

async function declineFriendRequest(userUid, requesterUid) {
  try {
    // Remove requester from user's friendRequests
    await updateDoc(doc(db, "users", userUid), {
      friendRequests: arrayRemove(requesterUid),
    });
    
    // Remove user from requester's sentRequests
    await updateDoc(doc(db, "users", requesterUid), {
      sentRequests: arrayRemove(userUid),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error declining friend request:", error);
    return { success: false, error };
  }
}

async function getAllUsers() {
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  setDoc,
  doc,
  db,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  createUserDocument,
  getUserData,
  getUserDataById,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllUsers,
};