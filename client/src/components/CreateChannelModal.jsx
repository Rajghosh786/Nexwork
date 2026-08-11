import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import api from "../services/api";
import { getInitials } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const CreateChannelModal = ({
    workspaceId,
    onClose,
    onChannelCreated,
}) => {
    const { user } = useAuth();
    const [channelName, setChannelName] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get("/conversations/members", {
                    params: { workspaceId },
                });
                const workspaceMembers = response.data.members || [];
                setMembers(workspaceMembers || []);
                if (user?.id) {setSelectedMemberIds([user.id])}
            } catch (fetchError) {
                console.error("Unable to load members", fetchError);
            }
        };

        if (workspaceId) {
            fetchMembers();
        }
    }, [workspaceId, user]);

    const toggleMember = (memberId) => {
        if (memberId === user?.id) {
            return;
        }

        setSelectedMemberIds((current) => {
            if (current.includes(memberId)) {
                return current.filter((id) => id !== memberId);
            }

            return [...current, memberId];
        });
    };

    const filteredMembers = members.filter((member) =>
        member.fullName
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!channelName.trim()) {
            setError("Channel name is required");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await api.post("/conversations", {
                workspaceId,
                type: "GROUP",
                name: channelName.trim(),
                participantIds: selectedMemberIds,
            });

            onChannelCreated(response.data.conversation);
            onClose();
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                    "Unable to create channel"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Create a channel</h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                        Channel name
                    </label>

                    <input
                        type="text"
                        value={channelName}
                        onChange={(event) =>
                            setChannelName(event.target.value)
                        }
                        placeholder="project-alpha"
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-gray-700"
                    />

                    <p className="mt-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                        Add members (optional)
                    </p>

                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search members..."
                            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-9 pr-3 text-xs outline-none dark:border-gray-700"
                        />
                    </div>

                    <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                        {filteredMembers.map((member) => (
                            <label
                                key={member.id}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMemberIds.includes(
                                        member.id
                                    )}
                                    disabled={member.id === user?.id}
                                    onChange={() => toggleMember(member.id)}
                                />

                                <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-200 text-[9px] font-bold dark:bg-gray-700">
                                    {getInitials(member.fullName)}
                                </div>

                                <span>{member.fullName}</span>
                            </label>
                        ))}
                    </div>

                    {error && (
                        <p className="mt-3 text-xs text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Create channel"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;
