Frontend Workflow

Package Installation

Frontend dependencies belong ONLY to:

client/

The AI must NEVER install packages itself.

The AI must NEVER run npm commands.

If a frontend dependency is required, the AI must only provide:

cd clientnpm install <package-name>

The AI must never instruct the developer to run a frontend npm command from the project root.

The AI must never create a root package.json or root node_modules directory.

If a dependency is actually a backend dependency, do not install it in client/.

If the correct location is uncertain, stop and ask instead of guessing.

Stack

React

Vite

JavaScript

Tailwind CSS

Do not convert the project to TypeScript.

Before Every Frontend Change

Always:

Read .ai/PROJECT_PLAN.md

Read this file

Inspect the existing relevant files

Preserve existing working functionality

Make only the requested change

Do not assume the current code matches an imagined architecture.

Folder Structure

Respect the existing:

client/src/

Current structure:

src/├── assets/├── App.css├── App.jsx├── index.css└── main.jsx

Additional folders may be introduced when required.

Examples:

components/pages/context/services/

Do not create folders just for the sake of creating folders.

Styling

Tailwind CSS is the primary styling system.

Use Tailwind for new UI.

Keep existing CSS only where it is genuinely required.

Do not create huge CSS files for simple styling.

UI Style

The application uses:

light theme

SaaS/productivity visual language

clean layouts

subtle borders

subtle shadows

consistent spacing

professional typography

restrained colors

responsive layouts

Follow the selected fifth reference design as the visual direction.

Components

Create reusable components when they are genuinely reused.

Do not create a component for every small <div>.

Prefer simple readable React components.

Forms

Every important form should have:

labels

controlled inputs where appropriate

validation

loading state

disabled submit state

backend error handling

success handling where relevant

Authentication

JWT must never be stored in:

localStorage

sessionStorage

Authentication uses HTTP-only cookies.

Frontend authentication state should be maintained using a simple React Context or similarly lightweight approach.

Do not install Redux for authentication.

API Requests

Use a centralized API configuration/client.

Do not hardcode the backend URL repeatedly.

Backend URL should come from the appropriate Vite environment variable.

Do not expose secrets through VITE environment variables.

Security

Frontend authorization is only for UI behavior.

The backend is always the real authorization boundary.

Never assume hiding a button makes an action secure.

Error Handling

Do not silently swallow errors.

Show useful user-facing messages.

Do not expose raw stack traces or sensitive backend information.

Code Style

Write code that a 20-year-old fresher can understand and explain.

Avoid:

unnecessary abstractions

unnecessary libraries

complicated state management

excessive comments

overly clever code

Prefer:

simple React

clear names

small understandable components

straightforward logic

Do Not Implement Early

Unless explicitly requested, do not implement:

organizations

subscriptions

payment

invitations

projects

tasks

analytics

AI

chat

real-time functionality

during the authentication phase.

Completion Rule

After frontend changes:

Run lint if available.

Run build if appropriate.

Fix errors caused by your changes.

Do not claim success if checks were not actually run.

Backend Is the Source of Truth

The frontend must never treat React Context as the permanent source of truth for backend data.

AuthContext should remain intentionally small.

Store only data required for:

knowing whether the user is authenticated

rendering basic authenticated-user information

controlling authentication-related UI

Do not store large organization/subscription/member datasets globally unless there is a clearly justified reason.

When backend data is needed:

Call the appropriate GET API.

Render the returned data.

After mutations, refetch the relevant GET endpoint when appropriate.

Do not manually duplicate backend state across multiple frontend contexts.

Frontend role/permission checks are UX helpers only.

Never rely on frontend state for security.

25. Authenticated Dashboard/Application Workflow

Authentication and onboarding are complete. The frontend is now moving into the authenticated application phase.

25.1 Dashboard Visual Direction

The dashboard follows the selected fifth reference design.

The UI should feel like a modern SaaS productivity application.

It should include:

left sidebar

workspace switcher

authenticated user/profile area

dashboard overview

projects/tasks information

productivity/activity information

responsive layout

light theme as default

dark mode

clean spacing

subtle borders and shadows

restrained colors

professional typography

Tailwind CSS is the styling system.

Do not create a separate large CSS file when Tailwind utilities are sufficient.

25.2 Workspace Switching

A user can belong to multiple workspaces.

Example:

Personal Workspace → PERSONAL
Company A → ADMIN
Company B → MEMBER

The same user can therefore be ADMIN in one organization and MEMBER in another.

The workspace switcher must eventually load the user's workspaces from the backend.

During the visual prototype, local dummy data is allowed.

After API integration:

do not hardcode real workspace membership

do not use dummy roles for authorization

do not assume the user belongs to only one organization

The selected workspace is frontend UI state only.

The backend must verify workspace membership for protected requests.

25.3 AuthContext Boundary

AuthContext stays intentionally small.

It may contain:

authenticated user

authentication state

loading state

logout

minimal authentication information

It should NOT become the global store for:

all workspaces

all members

all projects

all tasks

all notifications

all conversations

subscriptions

Those resources should be retrieved through their own backend GET APIs.

Backend data is the source of truth.

25.4 Dashboard Navigation

The planned application navigation is:

Dashboard
Projects
My Tasks
Boards
Issues
Calendar
Timeline
Members
Messages
Notifications
Settings

Build these gradually.

Do not create fake implementations for every module at once.

25.5 Project and Task Management

The application will combine functionality inspired by Trello and Jira.

Planned capabilities:

projects

project details

tasks

issues

assignees

priorities

statuses

due dates

descriptions

comments

progress

search

filters

Kanban board

issue list/detail views

Keep the first implementation simple and understandable.

25.6 Kanban Board

The initial board workflow is:

To Do
In Progress
Review
Done

The first version should focus on basic functionality.

Do not introduce complicated drag-and-drop architecture unless it is actually needed.

25.7 Jira-Style Issues

Issues may contain:

title

description

status

priority

assignee

reporter

project

due date

comments

created date

updated date

All issue data must belong to the correct workspace/project.

25.8 Chat

The application will support:

Single Chat
Group Chat

Existing messages should be loaded using normal GET APIs.

Sockets will later handle real-time events.

The intended flow is:

Open Messages
↓
GET existing conversations/messages
↓
Connect to socket
↓
Receive real-time events

Sockets are not the only source of persistent chat history.

25.9 Notifications

Planned notification types include:

workspace invitation

invitation accepted

task assignment

task update

project activity

mentions

important chat activity where appropriate

Unread notification state must eventually come from the backend.

25.10 Invitations

Organization ADMIN users can invite users using email.

Expected flow:

ADMIN
↓
Enter email
↓
Invitation created
↓
User accepts invitation
↓
Workspace membership created as MEMBER
↓
Workspace appears in workspace switcher

An invitation must not remove existing memberships.

A user may belong to multiple organizations.

The backend decides whether the current user is allowed to invite.

25.11 Theme

Supported themes:

Light
Dark

Light is the default.

Use Tailwind classes for styling.

Theme state can later be moved into a simple application-level context.

Do not add a large state-management library only for theme.

25.12 Responsive UI

Every application screen must work on:

desktop

laptop

tablet

mobile

The desktop sidebar should collapse or become mobile navigation on smaller screens.

Tables and task/project views must remain usable on small screens.

25.13 Dummy Dashboard Data

The current dashboard may use one local dashboardData constant for visual development.

This data is temporary.

It must never be used for:

authentication

authorization

security decisions

actual workspace membership

When APIs are ready, replace the relevant dummy data with backend responses.

25.14 Frontend Development Order

Follow this order:

1. Dashboard visual shell
2. Workspace GET API integration
3. Real workspace switcher
4. Workspace-aware dashboard
5. Members / workspace settings
6. Invitations
7. Projects
8. Tasks / Issues
9. Kanban boards
10. Notifications
11. Single chat
12. Group chat
13. Socket real-time events
14. Calendar / Timeline
15. Subscriptions / payment
16. AI
17. Testing and deployment

Do not jump to sockets, payments, or AI before the required underlying structure exists.

