import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Menu } from "lucide-react";

import Sidebar from "./Sidebar";
import InvitationPanel from "./InvitationPanel";
import DashboardHome from "./DashboardHome";
import ChatView from "./ChatView";
import CreateChannelModal from "./CreateChannelModal";
import CreateDirectMessageModal from "./CreateDirectMessageModal";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";
import { formatWorkspace } from "../utils/helpers";

const Dashboard = () => {
    const { user } = useAuth();
    const { socket } = useSocket();

    const [workspaces, setWorkspaces] = useState([]);
    const [workspacesLoading, setWorkspacesLoading] = useState(true);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);

    const [channels, setChannels] = useState([]);
    const [directMessages, setDirectMessages] = useState([]);

    const [activeView, setActiveView] = useState("home");
    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [invitationCount, setInvitationCount] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showInvitations, setShowInvitations] = useState(false);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showCreateDirectMessage, setShowCreateDirectMessage] =
        useState(false);

    const activeViewRef = useRef(activeView);
    const selectedConversationRef = useRef(selectedConversation);

    const displayName =
        user?.fullName?.split(" ")[0] || "there";

    const getWorkspaceId = (workspace) => {
        return workspace?.id || workspace?._id;
    };

    const getConversationId = (conversation) => {
        return conversation?.id || conversation?._id;
    };

    useEffect(() => {
        activeViewRef.current = activeView;
    }, [activeView]);

    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    const fetchWorkspaces = async () => {
        try {
            setWorkspacesLoading(true);

            const response = await api.get("/workspaces");

            const workspaceList = Array.isArray(response.data)
                ? response.data
                : response.data.workspaces || [];

            const formattedWorkspaces =
                workspaceList.map(formatWorkspace);

            setWorkspaces(formattedWorkspaces);

            setSelectedWorkspace((current) => {
                if (current) {
                    const currentId = getWorkspaceId(current);
                    const stillExists = formattedWorkspaces.find(
                        (workspace) =>
                            String(getWorkspaceId(workspace)) ===
                            String(currentId)
                    );

                    if (stillExists) {
                        return stillExists;
                    }
                }

                return formattedWorkspaces[0] || null;
            });
        } catch (error) {
            console.error("Failed to fetch workspaces:", error);
        } finally {
            setWorkspacesLoading(false);
        }
    };

    const fetchConversations = useCallback(async () => {
        const workspaceId = getWorkspaceId(selectedWorkspace);

        if (!workspaceId) {
            return;
        }

        try {
            const response = await api.get("/conversations", {
                params: { workspaceId },
            });

            const conversations = response.data.conversations || [];

            setChannels(
                conversations.filter(
                    (conversation) => conversation.type === "GROUP"
                )
            );

            setDirectMessages(
                conversations.filter(
                    (conversation) => conversation.type === "DIRECT"
                )
            );
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setChannels([]);
            setDirectMessages([]);
        }
    }, [selectedWorkspace]);

    const fetchInvitationCount = async () => {
        try {
            const response = await api.get("/invitations");
            const invitations = response.data.invitations || [];
            setInvitationCount(invitations.length);
        } catch (error) {
            console.error("Failed to fetch invitations:", error);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
        fetchInvitationCount();
    }, []);

    useEffect(() => {
        if (!selectedWorkspace) {
            return;
        }

        fetchConversations();
        setActiveView("home");
        setSelectedConversation(null);
    }, [selectedWorkspace, fetchConversations]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNewInvitation = () => {
            fetchInvitationCount();
        };

        socket.on("new_invitation", handleNewInvitation);

        return () => {
            socket.off("new_invitation", handleNewInvitation);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleUnreadUpdate = ({ conversationId, unreadCount }) => {
            const currentView = activeViewRef.current;
            const currentConversation =
                selectedConversationRef.current;
            const currentConversationId =
                getConversationId(currentConversation);

            if (
                currentView !== "home" &&
                currentConversationId &&
                String(currentConversationId) ===
                    String(conversationId)
            ) {
                return;
            }

            const updateList = (list) =>
                list.map((item) =>
                    String(getConversationId(item)) ===
                    String(conversationId)
                        ? { ...item, unreadCount }
                        : item
                );

            setChannels((current) => updateList(current));
            setDirectMessages((current) => updateList(current));
        };

        const handleChannelAdded = () => {
            fetchConversations();
        };

        const handleNewMessage = () => {
            fetchConversations();
        };

        socket.on("unread_update", handleUnreadUpdate);
        socket.on("channel_added", handleChannelAdded);
        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("unread_update", handleUnreadUpdate);
            socket.off("channel_added", handleChannelAdded);
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, fetchConversations]);

    const handleWorkspaceChange = (workspace) => {
        setSelectedWorkspace(workspace);
    };

    const handleNavigateHome = () => {
        setActiveView("home");
        setSelectedConversation(null);
        setShowSidebar(false);
    };

    const handleSelectConversation = (conversation, viewType) => {
        setSelectedConversation(conversation);
        setActiveView(viewType);
        setShowSidebar(false);

        const conversationId = getConversationId(conversation);

        const resetUnread = (list) =>
            list.map((item) =>
                String(getConversationId(item)) ===
                String(conversationId)
                    ? { ...item, unreadCount: 0 }
                    : item
            );

        setChannels((current) => resetUnread(current));
        setDirectMessages((current) => resetUnread(current));
    };

    const handleMarkAsRead = (conversationId) => {
        const resetUnread = (list) =>
            list.map((item) =>
                String(getConversationId(item)) ===
                String(conversationId)
                    ? { ...item, unreadCount: 0 }
                    : item
            );

        setChannels((current) => resetUnread(current));
        setDirectMessages((current) => resetUnread(current));
    };

    const handleChannelCreated = (conversation) => {
        fetchConversations();
        handleSelectConversation(conversation, "channel");
        setShowCreateChannel(false);
    };

    const handleDirectMessageCreated = (conversation) => {
        const conversationId = getConversationId(conversation);
        const formattedConversation = {
            ...conversation,
            type: "DIRECT",
            unreadCount: 0,
        };

        let conversationToOpen = formattedConversation;

        setDirectMessages((current) => {
            const existing = current.find(
                (item) =>
                    String(getConversationId(item)) ===
                    String(conversationId)
            );

            if (existing) {
                conversationToOpen = existing;
                return current;
            }

            return [formattedConversation, ...current];
        });

        handleSelectConversation(conversationToOpen, "dm");
        setShowCreateDirectMessage(false);
    };

    const handleInvitationUpdate = () => {
        fetchInvitationCount();
        fetchWorkspaces();
    };

    const sidebarProps = {
        workspaces,
        workspacesLoading,
        selectedWorkspace,
        setSelectedWorkspace: handleWorkspaceChange,
        channels,
        directMessages,
        activeView,
        selectedConversation,
        onNavigateHome: handleNavigateHome,
        onSelectConversation: handleSelectConversation,
        onCreateChannel: () => setShowCreateChannel(true),
        onCreateDirectMessage: () => setShowCreateDirectMessage(true),
        invitationCount,
        onInvitationClick: () => setShowInvitations(true),
    };

    const getPageTitle = () => {
        if (activeView === "home") {
            return "Home";
        }

        if (selectedConversation) {
            return selectedConversation.name;
        }

        return selectedWorkspace?.name || "Workspace";
    };

    return (
        <div className="h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-[#151519] dark:text-gray-100">
            {showSidebar && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowSidebar(false)}
                    />

                    <div className="relative z-10 h-full w-[246px]">
                        <Sidebar
                            {...sidebarProps}
                            onClose={() => setShowSidebar(false)}
                        />
                    </div>
                </div>
            )}

            <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
                <Sidebar {...sidebarProps} />
            </div>

            <main className="h-screen min-w-0 overflow-y-auto lg:ml-[246px]">
                <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-gray-800 dark:bg-[#1c1c21]/95">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400">
                                {activeView === "home"
                                    ? "Workspace"
                                    : activeView === "channel"
                                      ? "Channel"
                                      : "Direct Message"}
                            </p>

                            <p className="truncate text-sm font-semibold">
                                {getPageTitle()}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowInvitations(!showInvitations)
                            }
                            className="relative grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Bell className="h-5 w-5" />

                            {invitationCount > 0 && (
                                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-violet-600 px-1 text-[8px] font-bold text-white">
                                    {invitationCount}
                                </span>
                            )}
                        </button>

                        {showInvitations && (
                            <InvitationPanel
                                onClose={() => setShowInvitations(false)}
                                onUpdate={handleInvitationUpdate}
                            />
                        )}
                    </div>
                </header>

                {activeView === "home" ? (
                    <DashboardHome
                        displayName={displayName}
                        selectedWorkspace={selectedWorkspace}
                        workspaces={workspaces}
                        invitationCount={invitationCount}
                    />
                ) : (
                    <div className="h-[calc(100vh-70px)]">
                        <ChatView
                            conversation={selectedConversation}
                            workspaceId={getWorkspaceId(selectedWorkspace)}
                            onConversationUpdate={fetchConversations}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    </div>
                )}
            </main>

            {showCreateChannel && (
                <CreateChannelModal
                    workspaceId={getWorkspaceId(selectedWorkspace)}
                    onClose={() => setShowCreateChannel(false)}
                    onChannelCreated={handleChannelCreated}
                />
            )}

            {showCreateDirectMessage && (
                <CreateDirectMessageModal
                    workspaceId={getWorkspaceId(selectedWorkspace)}
                    onClose={() => setShowCreateDirectMessage(false)}
                    onDirectMessageCreated={handleDirectMessageCreated}
                />
            )}
        </div>
    );
};

export default Dashboard;
