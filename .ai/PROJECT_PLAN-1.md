Project Plan

1. Package Installation Rules

Package installation is controlled entirely by the developer.

The AI coding agent must NEVER:

install npm packages

uninstall npm packages

update npm packages

remove npm packages

run npm install

run npm uninstall

run npm update

modify package.json to add dependencies

modify package-lock.json for dependency installation

If a dependency is required, the AI must only provide the exact command for the developer to run manually.

2. Project Directory Rule

This project contains two completely separate npm applications:

client/
server/

The AI must NEVER assume npm commands should be executed from the project root.

Every package installation instruction must explicitly specify the directory.

Frontend dependencies:

cd client
npm install <package-name>

Backend dependencies:

cd server
npm install <package-name>

Never install frontend or backend packages in the project root.

Never create a root package.json or root node_modules directory.

3. Project Overview

This is a SaaS-style multi-workspace web application.

A person has:

one personal workspace

zero or more organization workspaces

A user can belong to multiple organizations at the same time.

The same user can have a different role in each organization.

Example:

User
├── Personal Workspace
│   └── PERSONAL
├── Company A
│   └── ADMIN
└── Company B
    └── MEMBER

The application is being built using:

React

Vite

Tailwind CSS

Node.js

Express.js

MongoDB

Mongoose

JavaScript

The existing Vite React and Node/Express/Mongo boilerplate must be preserved.

4. Current Status

Authentication + Initial Onboarding

STATUS: IMPLEMENTED

The following have been implemented and tested during development:

User registration

User login

User logout

Password hashing

JWT authentication

HTTP-only authentication cookie

GET /api/auth/me

AuthContext

Protected frontend routes

Backend authentication middleware

Personal workspace creation during registration

Personal workspace membership

Onboarding page

Personal onboarding completion

Organization setup page

Organization plan selection

Organization creation

Creator becomes organization ADMIN

onboardingCompleted enforcement

Redirecting completed users to the dashboard

The next major phase is the authenticated application/dashboard.

5. Locked Platform Roles

There are two platform-level roles:

USER

SUPER_ADMIN

Normal public users are always created as:

platformRole = USER

SUPER_ADMIN is reserved for the platform owner/employees.

SUPER_ADMIN must NEVER be selectable during public registration.

The frontend must never provide a public "Register as Super Admin" option.

The backend must ignore any platform role supplied by public registration.

6. User Architecture

A person has exactly ONE User account.

A User can have:

one personal workspace

zero or more organization memberships

A User is NOT restricted to one organization.

The organization role is NOT stored directly on the User.

7. Personal Workspace

Every normal user receives one personal workspace during registration.

The personal workspace:

is free

does not require payment

belongs to exactly one user

is separate from organizations

uses the PERSONAL membership role

A user cannot create unlimited personal workspaces.

Relationship:

User 1 -> 1 Personal Workspace

8. Organization Architecture

Organizations are separate from personal workspaces.

A User can belong to many organizations.

Organization membership is represented separately from the User.

The current membership roles are:

ADMIN

MEMBER

The person who creates an organization automatically becomes:

ADMIN

A person invited by an organization admin becomes:

MEMBER

Example:

User A
├── Personal Workspace → PERSONAL
├── Company A → ADMIN
└── Company B → MEMBER

The same user can therefore be an ADMIN in one organization and a MEMBER in another.

Do NOT store organization role directly on User.

9. Workspace / Membership Model

The current backend uses a workspace-based structure.

Conceptually:

User
Workspace
WorkspaceMember

Workspace represents both:

PERSONAL workspace

ORGANIZATION workspace

WorkspaceMember represents the relationship between a user and workspace.

The membership role is:

PERSONAL
ADMIN
MEMBER

The backend is responsible for deciding the role.

The frontend must never be trusted to decide organization ownership or role.

10. Organization Subscriptions

Organization subscription plans are planned as:

BASIC

PLUS

PRO

Subscriptions belong to organizations/workspaces, not directly to Users.

IMPORTANT CURRENT DECISION:

Real Razorpay/payment integration is postponed.

The dummy payment flow is also postponed as a real implementation.

Do not spend development time on real payment integration during the current dashboard phase.

The existing plan-selection UI can remain as part of the onboarding structure, but payment verification is NOT an authority for access until the subscription phase is implemented.

11. Organization Creation

Organization creation is separate from registration.

Current conceptual flow:

Register
↓
User created
↓
Personal Workspace created
↓
User authenticated
↓
Onboarding
↓
Choose Organization
↓
Enter Organization Name
↓
Choose BASIC / PLUS / PRO
↓
Organization Workspace created
↓
Creator becomes ADMIN
↓
Dashboard

The backend decides that the creator is ADMIN.

The client must never send:

{
  "role": "ADMIN"
}

as an authority for organization creation.

12. Invitations

Invitations are NOT part of the current authentication implementation.

Future organization functionality will allow:

ADMIN users to invite people by email

invited users to become MEMBERs

one user to accept memberships in multiple organizations

Invitations must not remove existing memberships.

Invitation ownership and permissions must always be checked by the backend.

13. Authentication Architecture

Authentication uses:

email

password

bcrypt password hashing

JWT

HTTP-only cookie

JWT must NOT be stored in:

localStorage

sessionStorage

The frontend does not directly access the JWT.

The browser sends the HTTP-only cookie with authenticated requests.

The backend verifies the JWT.

14. Registration Flow

Registration requires:

Full Name

Email

Password

Confirm Password

Confirm Password is frontend validation only.

It must not be stored in MongoDB.

Flow:

User enters registration details
↓
Frontend validates
↓
Backend validates
↓
Email normalized
↓
Duplicate email checked
↓
Password hashed
↓
User created with USER platform role
↓
Personal Workspace created
↓
Personal WorkspaceMember created with PERSONAL role
↓
JWT generated
↓
HTTP-only cookie created
↓
Authenticated user returned

15. Login Flow

Login requires:

Email

Password

Flow:

Email + Password
↓
Backend finds user
↓
Password compared with hash
↓
JWT generated
↓
HTTP-only cookie created
↓
Authenticated user returned
↓
Frontend verifies current user
↓
Completed onboarding → Dashboard
Incomplete onboarding → Onboarding

16. Logout Flow

Logout clears the authentication cookie.

After logout:

frontend auth state becomes unauthenticated

protected frontend routes become inaccessible

protected backend endpoints reject unauthenticated requests

17. Current User

Backend provides:

GET /api/auth/me

This endpoint returns safe information about the currently authenticated user.

It must NEVER return:

password

password hash

JWT secret

sensitive credentials

The frontend uses this endpoint to verify the current session.

18. Frontend State vs Backend Source of Truth

The backend is ALWAYS the authoritative source of truth.

AuthContext must remain small.

Frontend context should contain only the minimum information required for:

authentication state

basic authenticated-user display

authentication-related UI

Do NOT treat frontend context as authoritative for:

organization membership

organization roles

permissions

subscriptions

payment status

invitations

organization limits

complete organization data

When backend data is needed:

Frontend
↓
GET API
↓
Backend authoritative data
↓
Render response

After important mutations, prefer refetching the relevant GET endpoint instead of manually reconstructing backend state inside React.

Frontend authorization checks are only for UX.

Backend authorization is always authoritative.

19. Frontend UI Direction

The application uses:

light theme

modern SaaS design

professional interface

clean layouts

subtle borders

subtle shadows

good spacing

strong typography

restrained colors

responsive design

The visual direction follows the previously selected fifth reference design.

Do not use:

excessive gradients

neon colors

excessive glassmorphism

unnecessary animations

overly complicated UI

random decorative elements

Tailwind CSS is the primary styling system.

20. Code Style

Code must look like it was written by a competent 20-year-old fresher/junior developer.

Prefer:

readable code

straightforward logic

understandable functions

clear variable names

reasonable modularity

simple React

small understandable controllers

Avoid:

unnecessary abstractions

enterprise architecture

excessive design patterns

unnecessary dependencies

overly clever code

excessive comments

The code should still be secure and properly structured.

21. Existing Folder Structure

The two applications remain separate.

Frontend:

client/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

Backend:

server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── node_modules/
├── .env
├── .gitignore
├── db.js
├── package.json
├── package-lock.json
└── server.js

Do not completely restructure the project.

Create new folders/files only when actually required.

22. Development Rules

The architecture in this file is locked unless the developer explicitly changes it.

Do not:

replace JWT cookies with localStorage

make organization roles global User roles

restrict a User to one organization

attach subscriptions directly to Users

trust frontend role/permission values

install packages automatically

modify unrelated working functionality

implement future features without being asked

Before every change, read:

this project plan

the relevant frontend/backend workflow

the relevant existing files

23. Development Phase Order

The intended order is:

Phase 1

Authentication + initial onboarding — COMPLETED

Phase 2

Authenticated application shell/dashboard — NEXT

Phase 3

Workspace selection and organization management

Phase 4

Invitations and organization membership management

Phase 5

Subscription plans and dummy payment

Phase 6

Core application functionality

Phase 7

AI functionality

Phase 8

Testing, security and deployment

24. Current Immediate Goal

Authentication and initial onboarding are complete.

The next goal is to build the authenticated dashboard/application shell.

The dashboard must use the backend as the source of truth and must not assume that AuthContext contains complete organization/workspace data.

Workspace-related information should be retrieved through appropriate backend GET APIs.