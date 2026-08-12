const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const { connectingDB } = require("./db");

const authRoute = require("./routes/auth.route.js");
const onboardingRoute = require("./routes/onboarding.route");
const invitationRoute = require("./routes/invitation.route");
const workspaceRoute = require("./routes/workspace.route");
const chatRoute = require("./routes/chat.route");
const notificationRoute = require("./routes/notification.route");
const todoRoute = require("./routes/todo.route");
const projectRoute = require("./routes/project.route");
const issueRoute = require("./routes/issue.route");
const setupSocketHandlers = require("./socket/socket.handlers");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

app.set("io", io);

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

connectingDB();

app.use("/api/auth", authRoute);
app.use("/api/onboarding", onboardingRoute);
app.use("/api/invitations", invitationRoute);
app.use("/api/workspaces", workspaceRoute);
app.use("/api/conversations", chatRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/todo", todoRoute);

// Project and Issue routes are mounted under /api/workspaces for consistent hierarchy
app.use("/api/workspaces", projectRoute);
app.use("/api/workspaces", issueRoute);

setupSocketHandlers(io);

app.use((req, res) => {
    res.status(404).json({
        msg: "This request is not found",
    });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`Server started on ${port} port`);
});