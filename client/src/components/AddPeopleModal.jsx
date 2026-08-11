import { useEffect, useState } from "react";
import { X } from "lucide-react";

import api from "../services/api";
import { getInitials } from "../utils/helpers";

const AddPeopleModal = ({
    conversationId,
    workspaceId,
    currentMemberIds,
    onClose,
    onMembersAdded,
}) => {
    const [workspaceMembers, setWorkspaceMembers] = useState([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get("/conversations/members", {
                    params: { workspaceId },
                });

                const availableMembers = (
                    response.data.members || []
                ).filter(
                    (member) =>
                        !currentMemberIds.includes(String(member.id))
                );

                setWorkspaceMembers(availableMembers);
            } catch (fetchError) {
                console.error("Unable to load members", fetchError);
            }
        };

        if (workspaceId) {
            fetchMembers();
        }
    }, [workspaceId, currentMemberIds]);

    const toggleMember = (memberId) => {
        setSelectedMemberIds((current) => {
            if (current.includes(memberId)) {
                return current.filter((id) => id !== memberId);
            }

            return [...current, memberId];
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedMemberIds.length === 0) {
            setError("Select at least one member");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            await api.post(`/conversations/${conversationId}/members`, {
                memberIds: selectedMemberIds,
            });

            onMembersAdded();
            onClose();
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                    "Unable to add members"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Add people</h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-48 space-y-1 overflow-y-auto">
                        {workspaceMembers.length === 0 ? (
                            <p className="text-xs text-gray-400">
                                No more workspace members to add
                            </p>
                        ) : (
                            workspaceMembers.map((member) => (
                                <label
                                    key={member.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedMemberIds.includes(
                                            member.id
                                        )}
                                        onChange={() =>
                                            toggleMember(member.id)
                                        }
                                    />

                                    <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-200 text-[9px] font-bold dark:bg-gray-700">
                                        {getInitials(member.fullName)}
                                    </div>

                                    <span>{member.fullName}</span>
                                </label>
                            ))
                        )}
                    </div>

                    {error && (
                        <p className="mt-3 text-xs text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {isLoading ? "Adding..." : "Add to channel"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPeopleModal;
