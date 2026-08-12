# Nexwork

> A modern collaborative workspace for teams to communicate, organize projects, manage tasks, and work together in one place.

Nexwork is a full-stack team collaboration and productivity platform built with the MERN stack. It brings team communication, workspaces, channels, direct messages, project management, issue tracking, and real-time updates together into a single workspace.

The application is designed with a clean, modern interface featuring responsive layouts, dark/light theme support, real-time communication, and a focused workflow for managing both team communication and project work.

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* Secure authentication flow
* Form validation
* Server-side error handling
* Protected application routes
* Persistent authenticated user state
* Responsive authentication interface

### 🏢 Workspaces

Nexwork organizes collaboration around workspaces.

* Create and manage workspaces
* Switch between available workspaces
* Workspace-specific conversations
* Workspace membership management
* Organization-based workspaces
* Role-based workspace access

### 💬 Team Channels

Create group conversations for teams, projects, or specific topics.

* Create channels
* Custom channel names
* Add workspace members to channels
* Automatically include the channel creator
* Search workspace members while creating a channel
* View channel participants
* Add additional members
* Real-time channel creation notifications
* Channel-specific messaging
* Unread message counts
* Message mentions

### 👤 Direct Messages

Nexwork also supports private one-to-one conversations.

* Start a direct conversation with another workspace member
* Search available workspace members
* Automatically prevent duplicate direct conversations
* Display the other participant's name
* Real-time messaging
* Unread message tracking

### ⚡ Real-Time Communication

Real-time functionality is powered by Socket.IO.

Nexwork supports real-time events for:

* New messages
* New channels
* Unread message updates
* New invitations
* Mentions and notifications
* Channel membership changes

This allows users to receive important updates without manually refreshing the application.

### 🔔 Notifications & Mentions

Users can mention other members in conversations.

* `@username` style mentions
* Mention validation against conversation participants
* Mention notifications
* Notification panel
* Unread invitation/notification indicators

### 📩 Organization Invitations

Organization administrators can invite users to join their organization.

* Invite users by email
* Validate whether the user exists
* Prevent self-invitations
* Prevent inviting existing members
* Prevent duplicate pending invitations
* Accept invitations
* Reject invitations
* Real-time invitation notifications
* Organization membership creation after acceptance

### 📋 Projects

Nexwork includes project-level organization inside workspaces.

* View projects within a workspace
* Open individual project details
* Project names and descriptions
* Project-specific issue management
* Project navigation from the main dashboard

### 🐛 Issue Management

Projects contain an issue board for tracking work.

Issues can be organized into:

* **To Do**
* **In Progress**
* **Review**
* **Done**

The issue board supports:

* Drag-and-drop issue movement
* Optimistic status updates
* Automatic rollback if an update fails
* Issue details
* Issue priorities
* Due dates
* Assignees
* Comments
* Archived issues
* Project-level issue management

Supported priority levels:

* None
* Low
* Medium
* High
* Urgent

### 📝 To-Do Board

Nexwork also includes a personal to-do area for managing individual tasks separately from team projects.

### 🌓 Dark & Light Themes

The interface supports both light and dark themes.

Theme switching is available throughout the user-facing experience, including:

* Landing page
* Authentication pages
* Dashboard
* Workspace interface
* Project management
* Communication interface

### 📱 Responsive UI

The application is designed to work across different screen sizes.

The dashboard includes:

* Desktop sidebar navigation
* Mobile sidebar
* Responsive authentication pages
* Responsive landing page
* Flexible project and issue layouts

---

# 🖥️ Application Structure

Nexwork is divided into several major areas.

```text
Nexwork
│
├── Landing Page
│   ├── Hero
│   ├── Features
│   ├── Product Overview
│   ├── Call To Action
│   └── Footer
│
├── Authentication
│   ├── Login
│   └── Register
│
└── Dashboard
    │
    ├── Home
    │
    ├── Workspaces
    │
    ├── Channels
    │   ├── Channel Creation
    │   ├── Members
    │   └── Messages
    │
    ├── Direct Messages
    │
    ├── Invitations
    │
    ├── Notifications
    │
    ├── To-Do
    │
    └── Projects
        │
        ├── Project List
        │
        └── Project Details
            │
            └── Issue Board
                ├── To Do
                ├── In Progress
                ├── Review
                └── Done
```

---

# 🛠️ Tech Stack

## Frontend

* React
* React Router
* Tailwind CSS
* Axios
* Lucide React
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO

## Architecture

Nexwork follows a client-server architecture:

```text
React Frontend
      │
      │ REST API
      ▼
Express / Node.js Backend
      │
      ▼
   MongoDB
```

Real-time communication runs alongside the REST API:

```text
React Client
     │
     │ Socket.IO
     ▼
Node.js + Socket.IO
     │
     ▼
Connected Clients
```

---

# 📁 Project Structure

A simplified structure of the application looks like this:

```text
nexwork/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── todo/
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext
│   │   │   └── SocketContext
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   └── api
│   │   │
│   │   ├── utils/
│   │   │   └── helpers
│   │   │
│   │   └── ...
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> The exact folder structure may vary depending on the current organization of the repository.

---

# 🗄️ Data Models

Nexwork uses MongoDB with Mongoose.

Major models currently involved in the application include:

### User

Stores user account information such as:

* Full name
* Email
* Authentication information

### Workspace

Represents a collaborative workspace.

Workspaces can have different types, including organization workspaces.

### WorkspaceMember

Connects users to workspaces and stores their workspace role.

For example:

```text
ADMIN
MEMBER
```

### Conversation

Represents both channels and direct messages.

A conversation can be:

```text
DIRECT
GROUP
```

Group conversations contain:

* Workspace
* Channel name
* Participants
* Creator
* Creation/update timestamps

Direct conversations contain the two participating users.

### Message

Stores messages belonging to conversations.

Messages include:

* Conversation
* Workspace
* Sender
* Content
* Mentions
* Timestamp

### ConversationRead

Tracks when a user last read a conversation and is used to calculate unread message counts.

### Invitation

Stores organization invitations.

Invitation states include:

```text
PENDING
ACCEPTED
REJECTED
```

### Notification

Stores user notifications such as mentions.

---

# 🔄 Conversation System

One of Nexwork's core systems is the conversation architecture.

Both channels and direct messages use the same `Conversation` model.

```text
Conversation
│
├── GROUP
│   └── Channel
│
└── DIRECT
    └── One-to-one conversation
```

This allows messaging functionality to remain centralized while still supporting different conversation types.

For group channels, the creator is automatically added as a participant.

For direct messages, Nexwork checks whether a conversation already exists between the two users before creating another one.

---

# 🔒 Access Control

Workspace access is checked before performing workspace-specific operations.

A user must be a member of the workspace to:

* Access conversations
* Create conversations
* Send messages
* Access workspace members
* Perform workspace-related actions

Conversation-level access is also checked by verifying that the authenticated user is a participant.

This prevents users from accessing conversations they do not belong to.

---

# 🚀 Getting Started

## Prerequisites

Before running Nexwork locally, make sure you have:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

---

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd nexwork
```

---

## 2. Install dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

---

# 🔑 Environment Variables

Create an environment file for the backend.

Example:

```env
PORT=5000
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Add any additional environment variables required by your current backend configuration.

For the frontend, configure the API base URL according to the environment in which the application is running.

> Never commit real credentials, API keys, database passwords, or JWT secrets to the repository.

---

# ▶️ Running the Application

## Start the backend

```bash
cd server
npm run dev
```

or, depending on the configured scripts:

```bash
npm start
```

---

## Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The backend will run on the port configured in your environment.

---

# 🔌 API Overview

The backend exposes REST endpoints for the application's main functionality.

Examples include:

```text
/auth
/workspaces
/conversations
/invitations
```

Conversation functionality includes operations such as:

```text
GET    /conversations
POST   /conversations

GET    /conversations/:id
GET    /conversations/:id/members

POST   /conversations/:id/members

GET    /conversations/:id/messages
POST   /conversations/:id/messages
```

Workspace conversation retrieval is scoped using the workspace ID.

Example:

```text
GET /conversations?workspaceId=<workspaceId>
```

---

# ⚡ Real-Time Events

Socket.IO is used to provide real-time updates.

Important events include:

```text
new_message
channel_added
unread_update
new_invitation
new_notification
channel_members_updated
```

### `new_message`

Sent when a new message is created in a conversation.

### `channel_added`

Sent when a user is added to a new channel.

### `unread_update`

Updates the unread message count for a conversation.

### `new_invitation`

Notifies a user about a new organization invitation.

### `new_notification`

Used for notifications such as mentions.

### `channel_members_updated`

Notifies connected clients that channel membership has changed.

---

# 🎨 UI & Design

Nexwork uses a modern minimal interface focused on productivity.

The design language includes:

* Violet primary accent
* Rounded cards
* Subtle borders
* Soft shadows
* Glass-style surfaces
* Responsive layouts
* Dark/light themes
* Minimal typography
* Compact workspace navigation
* Drag-and-drop interactions

The landing page and authentication experience use the same visual identity as the main application.

---

# 🧩 Important Frontend Components

Some of the major UI components include:

```text
Dashboard
Sidebar
ChatView
CreateChannelModal
CreateDirectMessageModal
InvitationPanel
OrganizationMembersModal

ProjectsList
ProjectDetail
IssueBoard
IssueCard
IssueDetailModal

TodoBoard

AuthLayout
AuthInput
AuthButton
Login
Register
```

The `Dashboard` acts as the central application shell and coordinates:

* Workspace selection
* Conversations
* Direct messages
* Projects
* To-do navigation
* Invitations
* Organization members
* Notifications
* Responsive sidebar behavior

---

# 📌 Issue Board Workflow

Issues can be moved between four workflow states:

```text
TODO
  ↓
IN_PROGRESS
  ↓
REVIEW
  ↓
DONE
```

Users can drag issues between columns.

The frontend performs an optimistic update first:

```text
User drags issue
      ↓
UI updates immediately
      ↓
PATCH request sent
      ↓
Success → keep update
Failure → restore original state
```

This keeps the interface responsive while still handling API failures safely.

---

# 🧠 Design Decisions

### Shared Conversation Model

Channels and direct messages share one conversation model instead of maintaining separate messaging systems.

This reduces duplicated logic and makes it easier to add additional conversation functionality later.

### Optimistic UI

Issue status changes update the interface immediately while the backend request is processed.

If the request fails, the original state is restored.

### Workspace-Scoped Data

Conversations and members are scoped to workspaces, ensuring users only interact with data belonging to their current workspace.

### Real-Time Updates

Socket.IO is used for events that benefit from immediate updates rather than repeatedly polling the backend.

---

# 🛡️ Security Considerations

Nexwork performs server-side access checks for workspace and conversation operations.

Important principles include:

* Never trust client-side workspace membership
* Validate authenticated users on the server
* Verify workspace membership before accessing workspace data
* Verify conversation participation before accessing messages
* Validate invitation recipients
* Prevent duplicate pending invitations
* Keep secrets in environment variables
* Do not expose database credentials to the frontend

---

# 🧪 Future Improvements

Potential improvements for Nexwork include:

* File and image attachments
* Message editing and deletion
* Threaded conversations
* Typing indicators
* Online/offline presence
* Message reactions
* Advanced project permissions
* Project analytics
* Issue labels
* Issue search and filtering
* Workspace search
* User profile customization
* Email notifications
* Advanced notification preferences
* Pagination for messages
* Better mobile-specific interactions
* Automated testing
* CI/CD pipeline

---

# 🌐 Deployment

Nexwork can be deployed using separate frontend and backend services.

A typical deployment architecture would be:

```text
                    ┌─────────────────┐
                    │    Frontend     │
                    │     React       │
                    └────────┬────────┘
                             │
                       HTTPS / REST
                             │
                             ▼
                    ┌─────────────────┐
                    │     Backend     │
                    │ Node + Express  │
                    │   + Socket.IO   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MongoDB     │
                    │   Atlas / DB    │
                    └─────────────────┘
```

When deploying:

* Configure production environment variables
* Set the frontend URL in the backend configuration
* Configure the frontend API URL
* Configure Socket.IO for the production backend URL
* Use HTTPS
* Never expose private environment variables
* Configure MongoDB network access appropriately

---

# 📸 Screenshots

Add screenshots of the main Nexwork interfaces here as the project UI is finalized.

Recommended screenshots:

1. Landing page
2. Login page
3. Registration page
4. Dashboard
5. Workspace sidebar
6. Channel conversation
7. Direct message
8. Project list
9. Project issue board
10. Dark mode

Example:

```md
## Screenshots

### Landing Page

![Nexwork Landing Page](./screenshots/landing.png)

### Dashboard

![Nexwork Dashboard](./screenshots/dashboard.png)

### Project Board

![Nexwork Project Board](./screenshots/project-board.png)
```

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them locally, and create a pull request.

When contributing, try to:

* Keep components focused
* Follow the existing project structure
* Reuse existing utilities and contexts
* Validate data on the backend
* Keep UI responsive
* Maintain dark/light theme compatibility
* Avoid committing secrets or environment files

---

# 📄 License

This project is currently intended as a personal/project portfolio application.

Add your preferred license here if the project is later released as open source.

---

# 👨‍💻 Built With

Nexwork is built using:

**Frontend**

React • React Router • Tailwind CSS • Axios • Lucide React • Socket.IO Client

**Backend**

Node.js • Express.js • MongoDB • Mongoose • Socket.IO

---

## ⭐ Nexwork

Nexwork brings **communication, collaboration, and project management together in one workspace.**

Built to help teams communicate clearly, organize their work, and keep projects moving.
