# Dosti Network

Dosti Network is a social networking web application that allows users to connect with friends, send friend requests, and manage their social connections. The application is built with HTML, CSS, and JavaScript, and uses Firebase for authentication and data storage.

## Features

- User authentication (sign up and login)
- Dashboard with profile customization
- Add friends functionality
- Friend requests management
- Friends list
- Profile management

## Folder Structure

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

## How to Use

1. Open `index.html` in your web browser to start the application
2. Sign up for a new account or log in if you already have one
3. After logging in, you'll be redirected to your dashboard
4. Use the navigation menu to access different sections:
   - Home/Dashboard: View your profile and customize it
   - Add Friend: Search for and add new friends
   - Friend Requests: View and manage friend requests
   - Friends: View your friends list
   - Profile: Manage your profile details

## Firebase Configuration

The application uses Firebase for authentication and data storage. The configuration is set up in `AUTH/config.js`. Make sure to replace the Firebase configuration with your own project settings.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase (Authentication and Firestore)

## Setup Instructions

1. Clone or download this repository
2. Replace the Firebase configuration in `AUTH/config.js` with your own Firebase project configuration
3. Host the files on a web server or open `index.html` directly in a browser

## License

This project is open source and available under the MIT License.