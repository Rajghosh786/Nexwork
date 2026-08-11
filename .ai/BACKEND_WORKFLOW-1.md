Backend Workflow

1. Package Installation

Backend dependencies belong ONLY to:

server/

The AI must NEVER:

install packages

run npm commands

create a root package.json

create a root node_modules directory

modify package.json to install a dependency

If a dependency is required, provide only:

cd server
npm install <package-name>

If the correct location is uncertain, stop and ask instead of guessing.

2. Stack

Node.js

Express.js

JavaScript

MongoDB

Mongoose

Do not convert the project to TypeScript.

3. Before Every Backend Change

Always:

Read .ai/PROJECT_PLAN.md

Read this file

Inspect relevant existing files

Preserve existing working functionality

Implement only the requested feature

Do not assume the current code matches an imagined architecture.

4. Existing Structure

Current backend structure:

server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── db.js
├── package.json
└── server.js

Respect the existing structure.

Additional folders may be introduced only when they genuinely improve organization.

Do not create unnecessary architecture.

5. Architecture

Prefer:

routes
↓
controllers
↓
models

Simple helper functions are acceptable.

Do NOT introduce unnecessary:

repositories

services

factories

dependency injection systems

enterprise architecture

Keep the code understandable for a fresher.

6. Database

Use MongoDB through Mongoose.

Inspect the existing database configuration before changing it.

Do not create multiple competing MongoDB connection systems.

Current important models include the concepts:

User
Workspace
WorkspaceMember

A Workspace can represent either a personal or organization workspace.

7. Authentication

Authentication uses:

email/password

bcrypt password hashing

JWT

HTTP-only cookie

JWT must NOT be stored in frontend localStorage or sessionStorage.

The backend is responsible for verifying the JWT.

8. Passwords

Passwords must never be stored as plaintext.

Use the existing password hashing library.

Never return:

password

password hash

in normal API responses.

9. Platform Roles

Platform roles:

USER
SUPER_ADMIN

Public registration always creates:

USER

Never trust a platform role sent by the frontend.

SUPER_ADMIN is reserved for the platform owner/employees.

10. Workspace Roles

Workspace membership roles are:

PERSONAL
ADMIN
MEMBER

These roles belong to the WorkspaceMember relationship.

They do NOT belong directly on User.

Rules:

Personal workspace → PERSONAL

User creates organization → ADMIN

User invited to organization → MEMBER

The same User can therefore have:

Company A → ADMIN
Company B → MEMBER

The backend determines these roles.

Never trust a role supplied by the client.

11. Authentication vs Authorization

Authentication answers:

Who is this user?

Authorization answers:

Is this user allowed to perform this action in this workspace/organization?

Authentication is handled through the JWT cookie.

Organization/workspace authorization must verify the user's actual membership and role on the backend.

Never rely on frontend checks for security.

12. Validation

Validate important request data on the backend even if the frontend already validates it.

Never trust client-supplied:

platform roles

organization ownership

workspace membership

organization roles

permissions

payment status

invitation ownership

organization limits

The backend must determine these values from authenticated user and database state.

13. Current Authentication Endpoints

Current authentication functionality includes:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

Protected endpoints use the authentication middleware.

The /auth/me endpoint provides safe current-user information and must never expose password/hash/JWT secrets.

14. Onboarding Endpoints

Current onboarding functionality includes:

POST /api/onboarding/complete
POST /api/onboarding/organization

/onboarding/complete completes personal onboarding.

/onboarding/organization creates the organization workspace for the authenticated user.

For organization creation:

validate organization name

validate the selected plan value

get the current user from authentication

create the organization workspace

set the current user as owner of that workspace

create a WorkspaceMember record with ADMIN

mark onboarding as completed

The client must never be allowed to decide that it is the owner/admin.

15. Subscriptions and Payment

Planned organization plans:

BASIC
PLUS
PRO

Subscriptions belong to organizations/workspaces, not Users.

IMPORTANT:

Real Razorpay integration is postponed.

Do not add real payment processing unless explicitly requested.

Do not treat frontend payment state as proof of payment.

Future payment verification must be performed by the backend.

16. Invitations

Invitations are future functionality.

When implemented:

invitations are email-based

organization ADMIN users can invite members

MEMBER users cannot invite

invited users can belong to multiple organizations

accepting an invitation must not remove existing memberships

Every invitation action must be authorized by the backend.

17. HTTP Responses

Use sensible HTTP status codes.

Return understandable JSON responses.

Keep error responses reasonably consistent.

Do not expose stack traces to normal clients.

During development, log useful server-side errors without returning sensitive implementation details.

18. Environment Variables

Secrets belong in .env.

Never hardcode:

JWT secret

MongoDB credentials

API secrets

Never commit .env.

Only variable names belong in .env.example.

19. CORS

When cookies are used:

use a specific frontend origin

enable credentials

do not use wildcard origin with credentials

The existing server uses:

credentials: true

and the configured client origin.

20. Authentication Cookie

Authentication cookie should be:

HTTP-only

appropriately secure

appropriately sameSite

given an appropriate expiration

Development and production settings may differ when necessary.

The frontend must not directly read the JWT.

21. Backend Source of Truth

The backend is always authoritative for:

user identity

platform role

workspace membership

organization membership

organization role

permissions

subscription state

payment status

invitation status

organization limits

Never trust these values simply because the frontend sends or displays them.

Every protected operation must perform its own backend authorization check.

GET endpoints should provide the current authoritative state required by the frontend.

Frontend state must never be used as a security boundary.

22. Current Next Phase

Authentication and initial onboarding are complete.

The next backend work is the authenticated dashboard/application shell.

Before implementing dashboard functionality:

inspect the existing authentication code

keep /api/auth/me working

create GET endpoints only when the dashboard actually needs authoritative workspace/organization data

keep AuthContext small

do not put complete organization/member/subscription datasets into the authentication response

23. Code Style

Code should look like it was written by a competent 20-year-old fresher.

Prefer:

readable code

straightforward functions

clear variable names

small controllers

understandable middleware

simple error handling

Avoid unnecessary enterprise abstraction.

Do not intentionally write bad code.

24. Completion Rule

After backend changes:

Run relevant checks.

Test endpoints where possible.

Fix errors caused by your changes.

Never claim something works without actually checking it.

Never modify unrelated functionality.

If a package is needed, stop and provide the exact cd server + npm install command for the developer.

25. Authenticated Dashboard/Application Backend Workflow

Authentication and onboarding are complete. The next backend work is the authenticated application.

25.1 Backend Source of Truth

The backend is authoritative for:

authenticated user

workspace membership

organization role

permissions

projects

tasks/issues

notifications

conversations

invitations

subscriptions

Frontend state is never a security boundary.

25.2 Workspace GET API — NEXT BACKEND TASK

The immediate backend task is a protected endpoint that returns the workspaces available to the authenticated user.

Conceptually:

GET /api/workspaces

The response should contain safe information needed by the frontend, such as:

workspace ID

workspace name

workspace type

user's membership role

basic workspace information

Only workspaces that the current user actually belongs to should be returned.

Do not return passwords, secrets, or unnecessary private data.

25.3 Workspace Authorization

When a workspace-specific request is received:

authenticated user
↓
workspace ID
↓
find workspace membership
↓
verify membership
↓
verify required role if needed
↓
allow or reject

Never trust the workspace ID supplied by the frontend.

The frontend selected workspace is only UI state.

25.4 Workspace Types

The system supports:

PERSONAL
ORGANIZATION

Personal workspace:

free

belongs to one user

uses PERSONAL membership

Organization workspace:

multiple members

ADMIN and MEMBER roles

creator becomes ADMIN

The same user can be ADMIN in one organization and MEMBER in another.

25.5 Projects

Planned backend operations:

create project

get projects

get one project

update project

archive project

project members

Every project belongs to a workspace.

Every project request must verify workspace membership.

25.6 Tasks / Issues

Planned fields:

title
description
status
priority
assignee
reporter
project
workspace
dueDate
comments
createdAt
updatedAt

Every task/issue operation must verify workspace access.

25.7 Kanban Boards

Initial workflow:

TODO
IN_PROGRESS
REVIEW
DONE

Keep the first backend implementation simple.

Do not add complicated event architecture for board movement until basic CRUD works.

25.8 Jira-Style Issues

Issues should eventually support filtering by:

workspace

project

status

priority

assignee

Only add queries that the frontend actually needs.

25.9 Invitations

Only organization ADMIN users can create invitations.

Expected flow:

POST /api/invitations
↓
authenticate
↓
verify ADMIN membership
↓
validate email
↓
create invitation

Accepting:

authenticated user
↓
valid invitation
↓
create WorkspaceMember with MEMBER role
↓
keep existing memberships

The frontend must never be allowed to decide that an invited user is ADMIN.

25.10 Notifications

Notifications will eventually be persistent MongoDB data.

Possible events:

invitation received

invitation accepted

task assigned

task updated

mention

project activity

Possible API shape:

GET /api/notifications
PATCH /api/notifications/:id/read

Exact routes can be finalized when implementation begins.

25.11 Chat

The application will support:

Single Chat
Group Chat

Persistent conversations and messages belong in MongoDB.

Normal HTTP APIs load existing history.

Sockets handle real-time events such as:

new message

typing state if implemented

read updates if implemented

online state if implemented

Do not use sockets as the only source of persistent history.

Every chat operation must verify the user's workspace/conversation membership.

25.12 Real-Time Architecture

Use:

HTTP API
→ authentication
→ initial data
→ persistent database operations

Socket
→ real-time events

Do not introduce socket infrastructure before normal REST CRUD and authorization work.

25.13 Subscriptions

Organization plans remain:

BASIC
PLUS
PRO

Razorpay/payment implementation is intentionally postponed.

Do not implement payment logic during the initial dashboard/workspace phase.

25.14 Backend Development Order

1. Workspace GET API
2. Workspace authorization
3. Workspace-aware dashboard data
4. Members / workspace management
5. Invitations
6. Projects
7. Tasks / Issues
8. Boards
9. Notifications
10. Chat REST APIs
11. Socket real-time events
12. Calendar / Timeline APIs
13. Subscriptions / payment
14. AI
15. Testing and deployment

25.15 API Design Rule

Create an endpoint because the frontend needs the data or action.

Do not create dozens of unused endpoints in advance.

Keep:

routes
↓
controllers
↓
models

simple.

Do not introduce repositories, factories, or large service architecture unless there is a real need.