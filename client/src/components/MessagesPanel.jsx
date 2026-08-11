import { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import CreateDirectMessageModal from "./CreateDirectMessageModal";

const getInitials = (name) => {
    if (!name) {
        return "U";
    }

    const words = name.trim().split(" ");

    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
};

const formatTime = (dateString) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const MessagesPanel = ({ workspaceId }) => {
    const { user } = useAuth();
    const { socket } = useSocket();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [showCreateDirectMessage, setShowCreateDirectMessage] =
        useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

    const fetchConversations = async () => {
        try {
            const response = await api.get("/conversations", {
                params: { workspaceId },
            });

            setConversations(response.data.conversations);
        } catch (error) {
            console.error("Unable to load conversations", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await api.get("/conversations/members", {
                params: { workspaceId },
            });

            const otherMembers = response.data.members.filter(
                (member) => member.id !== user.id
            );

            setMembers(otherMembers);
        } catch (error) {
            console.error("Unable to load members", error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await api.get(
                `/conversations/${conversationId}/messages`
            );

            setMessages(response.data.messages);
        } catch (error) {
            console.error("Unable to load messages", error);
        }
    };

    useEffect(() => {
        if (!workspaceId) {
            return;
        }

        setIsLoading(true);
        setSelectedConversation(null);
        setMessages([]);
        fetchConversations();
        fetchMembers();
    }, [workspaceId]);

    useEffect(() => {
        if (!selectedConversation) {
            return;
        }

        fetchMessages(selectedConversation.id);

        const joinConversation = () => {
            socket.emit(
                "join_conversation",
                selectedConversation.id
            );

            console.log(
                "Joined conversation:",
                selectedConversation.id
            );
        };

        if (socket.connected) {
            joinConversation();
        } else {
            socket.once(
                "connect",
                joinConversation
            );
        }

        return () => {
            socket.off(
                "connect",
                joinConversation
            );

            if (socket.connected) {
                socket.emit(
                    "leave_conversation",
                    selectedConversation.id
                );
            }
        };
    }, [selectedConversation, socket]);

    useEffect(() => {
        const handleNewMessage = (message) => {
            if (
                selectedConversation &&
                message.conversationId === selectedConversation.id
            ) {
                setMessages((current) => {
                    const alreadyExists = current.some(
                        (item) => item.id === message.id
                    );

                    if (alreadyExists) {
                        return current;
                    }

                    return [...current, message];
                });
            }

            fetchConversations();
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [selectedConversation, socket]);

    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!messageText.trim() || !selectedConversation) {
            return;
        }

        try {
            setIsSending(true);

            const response = await api.post(
                `/conversations/${selectedConversation.id}/messages`,
                {
                    content: messageText.trim(),
                }
            );

            const newMessage = response.data.message;

            setMessages((current) => {
                const alreadyExists = current.some(
                    (item) => item.id === newMessage.id
                );

                if (alreadyExists) {
                    return current;
                }

                return [...current, newMessage];
            });

            setMessageText("");
            fetchConversations();
        } catch (error) {
            console.error("Unable to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleDirectMessageCreated = (conversation) => {
        setConversations((current) => {
            const exists = current.some(
                (item) =>
                    String(item.id) === String(conversation.id)
            );

            if (exists) {
                const existing = current.find(
                    (item) =>
                        String(item.id) === String(conversation.id)
                );

                setSelectedConversation(existing);
                return current;
            }

            return [conversation, ...current];
        });

        setSelectedConversation(conversation);
        setShowCreateDirectMessage(false);
    };

    const handleCreateGroupChat = async () => {
        if (!groupName.trim() || selectedGroupMembers.length === 0) {
            return;
        }

        try {
            const response = await api.post("/conversations", {
                workspaceId,
                type: "GROUP",
                name: groupName.trim(),
                participantIds: selectedGroupMembers,
            });

            const newConversation = response.data.conversation;

            setConversations((current) => [newConversation, ...current]);
            setSelectedConversation(newConversation);
            setShowNewChat(false);
            setGroupName("");
            setSelectedGroupMembers([]);
        } catch (error) {
            console.error("Unable to create group", error);
        }
    };

    const toggleGroupMember = (memberId) => {
        setSelectedGroupMembers((current) => {
            if (current.includes(memberId)) {
                return current.filter((id) => id !== memberId);
            }

            return [...current, memberId];
        });
    };

    const directConversations = conversations.filter(
        (conversation) => conversation.type === "DIRECT"
    );

    const groupConversations = conversations.filter(
        (conversation) => conversation.type === "GROUP"
    );

    if (isLoading) {
        return (
            <div className="flex h-[520px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c21]">
                <p className="text-sm text-gray-400">
                    Loading messages...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c21]">
            <div className="w-[280px] shrink-0 border-r border-gray-200 dark:border-gray-800">
                <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Messages
                        </h2>

                        <button
                            onClick={() =>
                                setShowCreateDirectMessage(true)
                            }
                            className="grid h-7 w-7 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    {showNewChat && (
                        <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <input
                                type="text"
                                value={groupName}
                                onChange={(event) =>
                                    setGroupName(event.target.value)
                                }
                                placeholder="Group name"
                                className="mb-2 w-full rounded border border-gray-200 bg-transparent px-2 py-1.5 text-xs dark:border-gray-700"
                            />

                            <div className="max-h-24 space-y-1 overflow-y-auto">
                                {members
                                    .filter(
                                        (member) =>
                                            String(member.id) !==
                                            String(user.id)
                                    )
                                    .map((member) => (
                                        <label
                                            key={member.id}
                                            className="flex items-center gap-2 text-[10px]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedGroupMembers.includes(
                                                    member.id
                                                )}
                                                onChange={() =>
                                                    toggleGroupMember(
                                                        member.id
                                                    )
                                                }
                                            />
                                            {member.fullName}
                                        </label>
                                    ))}
                            </div>

                            <button
                                onClick={handleCreateGroupChat}
                                className="mt-2 w-full rounded bg-violet-600 py-1.5 text-[10px] font-semibold text-white"
                            >
                                Create group
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-y-auto">
                    {directConversations.length > 0 && (
                        <>
                            <p className="px-4 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Direct Messages
                            </p>

                            {directConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() =>
                                        setSelectedConversation(
                                            conversation
                                        )
                                    }
                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                                        selectedConversation?.id ===
                                        conversation.id
                                            ? "bg-violet-50 dark:bg-violet-950/30"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                        {getInitials(conversation.name)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
                                            {conversation.name}
                                        </p>

                                        <p className="truncate text-[10px] text-gray-400">
                                            {conversation.lastMessage
                                                ?.content ||
                                                "No messages yet"}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}

                    {groupConversations.length > 0 && (
                        <>
                            <p className="px-4 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Groups
                            </p>

                            {groupConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() =>
                                        setSelectedConversation(
                                            conversation
                                        )
                                    }
                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                                        selectedConversation?.id ===
                                        conversation.id
                                            ? "bg-violet-50 dark:bg-violet-950/30"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-[9px] font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                        {getInitials(conversation.name)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
                                            {conversation.name}
                                        </p>

                                        <p className="truncate text-[10px] text-gray-400">
                                            {conversation.lastMessage
                                                ?.content ||
                                                "No messages yet"}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}

                    {conversations.length === 0 && (
                        <p className="px-4 py-8 text-center text-xs text-gray-400">
                            No conversations yet. Start a new chat.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                {!selectedConversation ? (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-sm text-gray-400">
                            Select a conversation or start a new one
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                {getInitials(selectedConversation.name)}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {selectedConversation.name}
                                </p>

                                <p className="text-[10px] text-gray-400">
                                    {selectedConversation.type === "GROUP"
                                        ? "Group chat"
                                        : "Direct message"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col overflow-y-auto p-5">
                            {messages.length === 0 ? (
                                <p className="text-center text-xs text-gray-400">
                                    No messages yet. Say hello!
                                </p>
                            ) : (
                                messages.map((message) => {
                                    const isOwnMessage =
                                        message.sender.id === user.id;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`mb-3 flex ${
                                                isOwnMessage
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                                    isOwnMessage
                                                        ? "rounded-br-md bg-violet-600 text-white"
                                                        : "rounded-bl-md bg-gray-100 dark:bg-gray-800"
                                                }`}
                                            >
                                                {!isOwnMessage && (
                                                    <p className="mb-1 text-[9px] font-semibold text-violet-600 dark:text-violet-300">
                                                        {
                                                            message.sender
                                                                .fullName
                                                        }
                                                    </p>
                                                )}

                                                <p
                                                    className={`text-xs leading-5 ${
                                                        isOwnMessage
                                                            ? "text-white"
                                                            : "text-gray-700 dark:text-gray-200"
                                                    }`}
                                                >
                                                    {message.content}
                                                </p>

                                                <p
                                                    className={`mt-1 text-[9px] ${
                                                        isOwnMessage
                                                            ? "text-right text-violet-200"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {formatTime(
                                                        message.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <form
                            onSubmit={handleSendMessage}
                            className="border-t border-gray-200 p-4 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(event) =>
                                        setMessageText(
                                            event.target.value
                                        )
                                    }
                                    placeholder={`Message ${selectedConversation.name}`}
                                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400"
                                />

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="text-violet-600 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {showCreateDirectMessage && (
                <CreateDirectMessageModal
                    workspaceId={workspaceId}
                    onClose={() => setShowCreateDirectMessage(false)}
                    onDirectMessageCreated={handleDirectMessageCreated}
                />
            )}
        </div>
    );
};

export default MessagesPanel;
