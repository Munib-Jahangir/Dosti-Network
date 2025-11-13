# Dosti Network

Dosti Network is a modern social networking web application that allows users to connect with friends, send friend requests, and manage their social connections. Built with HTML, CSS, and JavaScript, and powered by Firebase for authentication and data storage.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Web-blue.svg)](https://github.com)
[![Technologies](https://img.shields.io/badge/technologies-Firebase%20|%20JavaScript%20|%20HTML%20|%20CSS-orange.svg)](https://github.com)

## 🌟 Features

- **User Authentication** 🔐
  - Secure sign up and login with Firebase Authentication
  - Email and password validation
  - Session management

- **Dashboard** 📊
  - Personalized user dashboard
  - Profile customization options
  - User ID display

- **Social Features** 👥
  - Add friends functionality
  - Friend requests management (Accept/Decline)
  - Friends list with detailed profiles
  - Real-time friend status updates

- **Profile Management** 👤
  - Comprehensive profile editing
  - Display name, bio, phone, and location
  - Avatar with personalized initials

- **Modern UI/UX** 🎨
  - Premium midnight blue and sky blue theme
  - Glassmorphism design effects
  - Dark/light mode toggle with system preference detection
  - Responsive design for all devices
  - YouTube-style bottom navigation on mobile

## 📷 Screenshots & Animations


*Responsive design with bottom navigation*

## 📁 Folder Structure

```
Dosti Network/
│
├── AUTH/
│   ├── config.js          # Firebase configuration
│   ├── login.html         # Login page
│   ├── login.js           # Login functionality
│   ├── signup.html        # Signup page
│   └── signup.js          # Signup functionality
│
├── Main/
│   ├── Dashboard/
│   │   ├── Dashboard.html # User dashboard
│   │   ├── dashboard.css  # Dashboard styles
│   │   └── Dashboard.js   # Dashboard functionality
│   │
│   ├── Add freind/
│   │   ├── addfriends.html # Add friends page
│   │   ├── addfreinds.css  # Add friends styles
│   │   └── addfriends.js   # Add friends functionality
│   │
│   ├── Freind Request/
│   │   ├── index.html      # Friend requests page
│   │   ├── style.css       # Friend requests styles
│   │   └── script.js       # Friend requests functionality
│   │
│   ├── Freinds/
│   │   ├── friends.html    # Friends list page
│   │   ├── freinds.css     # Friends list styles
│   │   └── friends.js      # Friends list functionality
│   │
│   └── profile/
│       ├── profile.html    # User profile page
│       ├── profile.css     # Profile styles
│       └── profile.js      # Profile functionality
│
├── index.html              # Main entry point
└── README.md               # This file
```

## 🚀 How to Use

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/dosti-network.git
   ```

2. **Open the Application**
   - Double-click `index.html` to start the application
   - Or host the files on a web server for full functionality

3. **User Flow**
   - Sign up for a new account or log in if you already have one
   - After logging in, you'll be redirected to your dashboard
   - Use the navigation menu to access different sections:
     - **Home/Dashboard**: View your profile and customize it
     - **Add Friend**: Search for and add new friends
     - **Friend Requests**: View and manage friend requests
     - **Friends**: View your friends list
     - **Profile**: Manage your profile details

## 🔧 Firebase Configuration

The application uses Firebase for authentication and data storage. The configuration is set up in `AUTH/config.js`. 

To use your own Firebase project:

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Replace the Firebase configuration in `AUTH/config.js` with your own project settings:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

5. Set up Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎨 Design & Animations

### Color Scheme
- **Primary**: Midnight Blue (`#0a192f`)
- **Accent**: Aqua Sky Blue (`#00ffff`)
- **Background**: Gradient dark blue
- **Light Mode**: Pearl White with blue accents

### UI Features
- **Glassmorphism Effects**: Frosted glass panels with backdrop blur
- **Smooth Animations**: 
  - Fade-in transitions
  - Hover effects with elevation
  - Pulse animations for interactive elements
  - Floating cards
- **Responsive Design**: 
  - Mobile-first approach
  - YouTube-style bottom navigation
  - Icon-only navigation on mobile
- **Dark/Light Mode**: 
  - Automatic detection of system preference
  - Manual toggle with localStorage persistence

### Animation Details
- **Page Transitions**: Smooth fade-in effects when loading pages
- **Button Interactions**: 3D hover effects with shadow depth
- **Card Animations**: Floating effect on friend cards
- **Text Effects**: Glowing text for headings
- **Navigation**: Smooth transitions between sections

## 🛠 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **UI Framework**: Custom CSS with glassmorphism
- **Icons**: Font Awesome
- **Animations**: CSS3 Keyframes and Transitions

## 📱 Responsive Features

- **Mobile Optimization**: 
  - Bottom navigation bar for thumb-friendly access
  - Icon-only navigation on small screens
  - Adaptive layouts for all screen sizes
- **Tablet Support**: Optimized layouts for medium screens
- **Desktop Experience**: Full-featured interface with expanded controls

## 🔒 Security

- **Authentication**: Firebase Authentication for secure login
- **Data Protection**: Firestore security rules to prevent unauthorized access
- **Client-side Validation**: Form validation for data integrity
- **Secure Storage**: User data stored securely in Firestore

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgements

- [Firebase](https://firebase.google.com/) for authentication and database
- [Font Awesome](https://fontawesome.com/) for icons
- Inspired by modern social networking platforms

## 📞 Support

For support, email [munibjahangir10@gmail.com] or open an issue in the repository.
