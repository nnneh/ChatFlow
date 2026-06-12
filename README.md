# ChatFlow - Real-Time Chat Application

A modern real-time chat application that enables users to communicate seamlessly through individual and group conversations with instant message delivery and real-time updates.

## Features

*  User Authentication (Sign Up, Login, Logout)
*  Secure JWT-Based Authorization
*  Real-Time Messaging with Socket.io
*  One-to-One Private Chats
*  Group Chat Functionality
*  Friend Request Management
*  Online/Offline User Status
*  Real-Time Notifications
*  Typing Indicators
*  Message Timestamps
*  Media Sharing (Images & Files)
*  User Profile Management
*  Profile Picture Uploads
*  Responsive User Interface

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Redux Toolkit
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io

### Database

* MongoDB
* Mongoose

### Cloud Services

* Cloudinary (Image Storage)

### Authentication

* JWT (JSON Web Tokens)
* bcrypt.js (Password Hashing)

## Project Structure

```bash
ChatFlow/
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── utils/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   └── config/
│
└── README.md
```

## To-Do List

### Authentication

* [] User Registration
* [] User Login
* [] User Logout
* [] JWT Authentication
* [] Password Hashing using bcrypt
* [] User Profile Creation
* [] Profile Picture Upload

### User Management

* [] Search Users
* [] Send Friend Requests
* [] Accept/Reject Friend Requests
* [] Manage Friend List
* [] View User Profiles

### Real-Time Communication

* [] Socket.io Integration
* [] Individual Chat
* [] Group Chat
* [] Real-Time Message Delivery
* [] Typing Indicators
* [] Online/Offline Presence
* [] Real-Time Notifications

### Messaging Features

* [] Send Text Messages
* [] Send Images
* [] Send Files
* [] Message Timestamps
* [] Chat History Persistence

### Group Features

* [] Create Groups
* [] Add Members
* [] Remove Members
* [] Group Information Management
* [] Group Update Notifications

### UI/UX

* [] Responsive Design
* [] Modern Chat Interface
* [] Individual Chat Layout
* [] Group Chat Layout
* [] User Profile Section
* [] Group Information Section
* [] Notification System

## Installation

### Clone the Repository

```bash
git clone https://github.com/nnneh/chatflow.git
cd chatflow
```

### Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run the Application

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm start
```

## Future Enhancements

* ⏳ Read Receipts
* ⏳ Message Reactions
* ⏳ Voice Messages
* ⏳ Video Calling
* ⏳ Audio Calling
* ⏳ End-to-End Encryption
* ⏳ Message Editing
* ⏳ Message Deletion for Everyone
* ⏳ Dark/Light Theme Toggle
* ⏳ Push Notifications


