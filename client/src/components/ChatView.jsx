import { useEffect, useRef, useState } from "react";
import { Send, UserPlus } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { formatTime, getInitials } from "../utils/helpers";
import AddPeopleModal from "./AddPeopleModal";

const renderMessageContent = (content, mentions = []) => {
    if (!content) {
        return "";
    }

    const parts = content.split(/(@\w+)/g);

    return parts.map((part, index) => {
        if (part.startsWith("@")) {
            const mentionName = part.slice(1).toLowerCase();
            const mentionedUser = mentions.find((mention) => {
                const fullName = mention.fullName.toLowerCase();
                const firstName = fullName.split(" ")[0];

                return (
                    firstName === mentionName ||
                    fullName.startsWith(mentionName)
                );
            });

            if (mentionedUser) {
                return (
                    <span
                        key={index}
                        className="rounded bg-violet-200/30 px-1 font-semibold text-violet-700 dark:text-violet-300"
                    >
                        {part}
                    </span>
                );
            }
        }

        return <span key={index}>{part}</span>;
    });
};

const ChatView = ({
    conversation,
    workspaceId,
    onConversationUpdate,
    onMarkAsRead,
}) => {
    const { user } = useAuth();
    const { socket } = useSocket();

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [channelMembers, setChannelMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showAddPeople, setShowAddPeople] = useState(false);
    const [showMentionList, setShowMentionList] = useState(false);
    const [mentionSearch, setMentionSearch] = useState("");

    const conversationIdRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        conversationIdRef.current = conversation?.id
            ? String(conversation.id)
            : null;
    }, [conversation?.id]);

    const fetchMessages = async (conversationId) => {
        try {
            setIsLoading(true);

            const response = await api.get(
                `/conversations/${conversationId}/messages`
            );

            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("Unable to load messages", error);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchChannelMembers = async (conversationId) => {
        if (conversation?.type !== "GROUP") {
            return;
        }

        try {
            const response = await api.get(
                `/conversations/${conversationId}/members`
            );

            setChannelMembers(response.data.members || []);
        } catch (error) {
            console.error("Unable to load channel members", error);
        }
    };

    const markAsRead = async (conversationId) => {
        try {
            await api.patch(`/conversations/${conversationId}/read`);

            if (onMarkAsRead) {
                onMarkAsRead(conversationId);
            }
        } catch (error) {
            console.error("Unable to mark as read", error);
        }
    };

    useEffect(() => {
        if (!conversation?.id) {
            setMessages([]);
            return;
        }

        fetchMessages(conversation.id);
        fetchChannelMembers(conversation.id);
        markAsRead(conversation.id);
    }, [conversation?.id]);

    useEffect(() => {
        if (!socket || !conversation?.id) {
            return;
        }

        const conversationId = String(conversation.id);

        const joinRoom = () => {
            socket.emit("join_conversation", conversationId);
        };

        if (socket.connected) {
            joinRoom();
        } else {
            socket.once("connect", joinRoom);
        }

        return () => {
            socket.off("connect", joinRoom);

            if (socket.connected) {
                socket.emit("leave_conversation", conversationId);
            }
        };
    }, [socket, conversation?.id]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNewMessage = (message) => {
            const currentConversationId = conversationIdRef.current;

            if (
                !currentConversationId ||
                String(message.conversationId) !== currentConversationId
            ) {
                return;
            }

            setMessages((current) => {
                const alreadyExists = current.some(
                    (item) => String(item.id) === String(message.id)
                );

                if (alreadyExists) {
                    return current;
                }

                return [...current, message];
            });

            markAsRead(currentConversationId);

            if (onConversationUpdate) {
                onConversationUpdate();
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, onConversationUpdate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleMessageChange = (event) => {
        const value = event.target.value;
        setMessageText(value);

        const lastAtIndex = value.lastIndexOf("@");

        if (lastAtIndex !== -1) {
            const textAfterAt = value.slice(lastAtIndex + 1);

            if (!textAfterAt.includes(" ")) {
                setMentionSearch(textAfterAt.toLowerCase());
                setShowMentionList(true);
                return;
            }
        }

        setShowMentionList(false);
        setMentionSearch("");
    };

    const handleSelectMention = (member) => {
        const firstName = member.fullName.split(" ")[0];
        const lastAtIndex = messageText.lastIndexOf("@");

        const newText =
            messageText.slice(0, lastAtIndex) + `@${firstName} `;

        setMessageText(newText);
        setShowMentionList(false);
        setMentionSearch("");
    };

    const filteredMentionMembers = channelMembers.filter((member) => {
        if (String(member.id) === String(user.id)) {
            return false;
        }

        if (!mentionSearch) {
            return true;
        }

        return member.fullName.toLowerCase().includes(mentionSearch);
    });

    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!messageText.trim() || !conversation?.id) {
            return;
        }

        try {
            setIsSending(true);
            setShowMentionList(false);

            const response = await api.post(
                `/conversations/${conversation.id}/messages`,
                {
                    content: messageText.trim(),
                }
            );

            const newMessage = response.data.message;

            setMessages((current) => {
                const alreadyExists = current.some(
                    (item) => String(item.id) === String(newMessage.id)
                );

                if (alreadyExists) {
                    return current;
                }

                return [...current, newMessage];
            });

            setMessageText("");

            if (onConversationUpdate) {
                onConversationUpdate();
            }
        } catch (error) {
            console.error("Unable to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    const currentMemberIds = channelMembers.map((member) =>
        String(member.id)
    );

    if (!conversation) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p className="text-sm text-gray-400">
                    Select a conversation from the sidebar
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div
                        className={`grid h-9 w-9 place-items-center text-xs font-bold ${
                            conversation.type === "GROUP"
                                ? "rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                                : "rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                    >
                        {getInitials(conversation.name)}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {conversation.name}
                        </p>

                        <p className="text-[10px] text-gray-400">
                            {conversation.type === "GROUP"
                                ? "Channel"
                                : "Direct message"}
                        </p>
                    </div>
                </div>

                {conversation.type === "GROUP" && (
                    <button
                        onClick={() => setShowAddPeople(true)}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add people
                    </button>
                )}
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-5">
                {isLoading ? (
                    <p className="text-center text-xs text-gray-400">
                        Loading messages...
                    </p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-xs text-gray-400">
                        No messages yet. Say hello!
                    </p>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage =
                            String(message.sender.id) === String(user.id);

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
                                            {message.sender.fullName}
                                        </p>
                                    )}

                                    <p
                                        className={`text-xs leading-5 ${
                                            isOwnMessage
                                                ? "text-white"
                                                : "text-gray-700 dark:text-gray-200"
                                        }`}
                                    >
                                        {renderMessageContent(
                                            message.content,
                                            message.mentions
                                        )}
                                    </p>

                                    <p
                                        className={`mt-1 text-[9px] ${
                                            isOwnMessage
                                                ? "text-right text-violet-200"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {formatTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="relative border-t border-gray-200 p-4 dark:border-gray-800"
            >
                {showMentionList &&
                    conversation.type === "GROUP" &&
                    filteredMentionMembers.length > 0 && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1c1c21]">
                            {filteredMentionMembers.map((member) => (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() =>
                                        handleSelectMention(member)
                                    }
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-200 text-[9px] font-bold dark:bg-gray-700">
                                        {getInitials(member.fullName)}
                                    </div>
                                    {member.fullName}
                                </button>
                            ))}
                        </div>
                    )}

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700">
                    <input
                        type="text"
                        value={messageText}
                        onChange={handleMessageChange}
                        placeholder={`Message ${conversation.name}`}
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

            {showAddPeople && (
                <AddPeopleModal
                    conversationId={conversation.id}
                    workspaceId={workspaceId}
                    currentMemberIds={currentMemberIds}
                    onClose={() => setShowAddPeople(false)}
                    onMembersAdded={() => {
                        fetchChannelMembers(conversation.id);

                        if (onConversationUpdate) {
                            onConversationUpdate();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ChatView;
