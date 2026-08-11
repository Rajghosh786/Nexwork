import { useState } from "react";
import {
    Hash,
    Home,
    LogOut,
    Mail,
    ListTodo,
    Moon,
    Plus,
    Sun,
    X,
    BookOpenCheck,
} from "lucide-react";

import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import { getInitials } from "../utils/helpers";

const SidebarSection = ({ title, children }) => {
    return (
        <div className="mt-5">
            <p className="px-4 pb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                {title}
            </p>

            <div className="space-y-0.5 px-2">{children}</div>
        </div>
    );
};

const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
    badge,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition ${
                active
                    ? "bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
        >
            {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}

            <span className="flex-1 truncate">{label}</span>

            {badge > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-violet-600 px-1 text-[8px] font-bold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
};

const Sidebar = ({
    workspaces,
    workspacesLoading,
    selectedWorkspace,
    setSelectedWorkspace,
    channels,
    directMessages,
    activeView,
    selectedConversation,
    onNavigateHome,
    onNavigateTodo,
    onSelectConversation,
    onCreateChannel,
    onCreateDirectMessage,
    invitationCount,
    onInvitationClick,
    onClose,
}) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteError, setInviteError] = useState("");
    const [inviteSuccess, setInviteSuccess] = useState("");
    const [isSendingInvite, setIsSendingInvite] = useState(false);

    const initials =
        user?.fullName
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    const canSendInvitations =
        selectedWorkspace?.type === "ORGANIZATION" &&
        selectedWorkspace?.role === "ADMIN";

    const getConversationId = (conversation) => {
        return conversation?.id || conversation?._id;
    };

    const selectedConversationId = getConversationId(selectedConversation);

    const handleSendInvitation = async (event) => {
        event.preventDefault();

        if (!inviteEmail.trim()) {
            setInviteError("Email is required");
            return;
        }

        try {
            setIsSendingInvite(true);
            setInviteError("");
            setInviteSuccess("");

            await api.post("/invitations/send", {
                email: inviteEmail.trim(),
                workspaceId:
                    selectedWorkspace.id || selectedWorkspace._id,
            });

            setInviteSuccess("Invitation sent successfully");
            setInviteEmail("");
        } catch (error) {
            setInviteError(
                error.response?.data?.message ||
                    "Unable to send invitation"
            );
        } finally {
            setIsSendingInvite(false);
        }
    };

    return (
        <aside className="flex h-screen w-[246px] shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c21]">
            <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-gray-100 px-5 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        Nexwork
                    </span>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="shrink-0">
                {workspacesLoading ? (
                    <div className="px-4 py-6 text-xs text-gray-400">
                        Loading workspaces...
                    </div>
                ) : (
                    <WorkspaceSwitcher
                        workspaces={workspaces}
                        selectedWorkspace={selectedWorkspace}
                        setSelectedWorkspace={setSelectedWorkspace}
                    />
                )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto py-2">
                <SidebarSection title="Dashboard">
                    <SidebarItem
                        icon={Home}
                        label="Home"
                        active={activeView === "home"}
                        onClick={onNavigateHome}
                    />
                    <SidebarItem
                        icon={ListTodo}
                        label="To-Do"
                        active={activeView === "todo"}
                        onClick={onNavigateTodo}
                    />
                    <SidebarItem
                        icon={BookOpenCheck}
                        label="Collab Task"
                        // active={activeView === "todo"}
                        onClick={onNavigateTodo}
                    />
                </SidebarSection>

                <div className="mt-5">
                    <div className="flex items-center justify-between px-4 pb-2">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                            Channels
                        </p>

                        <button
                            onClick={onCreateChannel}
                            title="Create channel"
                            className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="space-y-0.5 px-2">
                        {channels.length === 0 ? (
                            <p className="px-3 py-2 text-[10px] text-gray-400">
                                No channels yet
                            </p>
                        ) : (
                            channels.map((channel) => {
                                const channelId =
                                    getConversationId(channel);
                                const isActive =
                                    activeView === "channel" &&
                                    String(selectedConversationId) ===
                                        String(channelId);

                                return (
                                    <SidebarItem
                                        key={channelId}
                                        icon={Hash}
                                        label={channel.name}
                                        active={isActive}
                                        badge={channel.unreadCount}
                                        onClick={() =>
                                            onSelectConversation(
                                                channel,
                                                "channel"
                                            )
                                        }
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between px-4 pb-2">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                            Direct Messages
                        </p>

                        <button
                            onClick={onCreateDirectMessage}
                            title="New direct message"
                            className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="space-y-0.5 px-2">
                        {directMessages.length === 0 ? (
                            <p className="px-3 py-2 text-[10px] text-gray-400">
                                No direct messages yet
                            </p>
                        ) : (
                            directMessages.map((conversation) => {
                                const conversationId =
                                    getConversationId(conversation);
                                const isActive =
                                    activeView === "dm" &&
                                    String(selectedConversationId) ===
                                        String(conversationId);

                                return (
                                    <button
                                        key={conversationId}
                                        onClick={() =>
                                            onSelectConversation(
                                                conversation,
                                                "dm"
                                            )
                                        }
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition ${
                                            isActive
                                                ? "bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-200 text-[9px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                            {getInitials(conversation.name)}
                                        </div>

                                        <span className="flex-1 truncate">
                                            {conversation.name}
                                        </span>

                                        {conversation.unreadCount > 0 && (
                                            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-violet-600 px-1 text-[8px] font-bold text-white">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {canSendInvitations && (
                    <SidebarSection title="Organization">
                        <button
                            onClick={() =>
                                setShowInviteForm(!showInviteForm)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            <span>Invite member</span>
                        </button>

                        {showInviteForm && (
                            <form
                                onSubmit={handleSendInvitation}
                                className="mx-2 mt-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                            >
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(event) =>
                                        setInviteEmail(event.target.value)
                                    }
                                    placeholder="user@email.com"
                                    className="w-full rounded border border-gray-200 bg-transparent px-2 py-1.5 text-[10px] outline-none dark:border-gray-700"
                                />

                                {inviteError && (
                                    <p className="mt-2 text-[10px] text-red-500">
                                        {inviteError}
                                    </p>
                                )}

                                {inviteSuccess && (
                                    <p className="mt-2 text-[10px] text-green-600">
                                        {inviteSuccess}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSendingInvite}
                                    className="mt-2 w-full rounded bg-violet-600 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50"
                                >
                                    {isSendingInvite
                                        ? "Sending..."
                                        : "Send invitation"}
                                </button>
                            </form>
                        )}
                    </SidebarSection>
                )}
            </div>

            <div className="shrink-0 border-t border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-[#1c1c21]">
                <button
                    onClick={onInvitationClick}
                    className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="flex-1">Invitations</span>

                    {invitationCount > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-600 px-1 text-[9px] font-bold text-white">
                            {invitationCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    {theme === "light" ? (
                        <Moon className="h-4 w-4 shrink-0" />
                    ) : (
                        <Sun className="h-4 w-4 shrink-0" />
                    )}

                    <span>
                        {theme === "light" ? "Dark mode" : "Light mode"}
                    </span>
                </button>

                <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

                <div className="flex items-center gap-2 rounded-lg p-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-gray-900 dark:text-white">
                            {user?.fullName || "User"}
                        </p>

                        <p className="truncate text-[10px] text-gray-400">
                            {user?.email || ""}
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        title="Logout"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
