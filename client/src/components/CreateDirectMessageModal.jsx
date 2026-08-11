import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";

const CreateDirectMessageModal = ({
    workspaceId,
    onClose,
    onDirectMessageCreated,
}) => {
    const { user } = useAuth();

    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get("/conversations/members", {
                    params: { workspaceId },
                });

                const workspaceMembers = response.data.members || [];

                const otherMembers = workspaceMembers.filter(
                    (member) =>
                        String(member.id) !== String(user?.id)
                );

                setMembers(otherMembers);
            } catch (fetchError) {
                console.error("Unable to load members", fetchError);
            }
        };

        if (workspaceId && user?.id) {
            fetchMembers();
        }
    }, [workspaceId, user?.id]);

    const filteredMembers = members.filter((member) => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            member.fullName?.toLowerCase().includes(searchText) ||
            member.email?.toLowerCase().includes(searchText)
        );
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedMemberId) {
            setError("Please select a member");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await api.post("/conversations", {
                workspaceId,
                type: "DIRECT",
                participantIds: [selectedMemberId],
            });

            onDirectMessageCreated(response.data.conversation);
            onClose();
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                    "Unable to start conversation"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                        New direct message
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search members..."
                            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none dark:border-gray-700"
                        />
                    </div>

                    <div className="mt-3 max-h-48 space-y-1 overflow-y-auto">
                        {filteredMembers.length === 0 ? (
                            <p className="py-4 text-center text-xs text-gray-400">
                                No members found
                            </p>
                        ) : (
                            filteredMembers.map((member) => {
                                const isSelected =
                                    String(selectedMemberId) ===
                                    String(member.id);

                                return (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedMemberId(member.id)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-xs transition ${
                                            isSelected
                                                ? "bg-violet-50 dark:bg-violet-950/30"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-200 text-[9px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                            {getInitials(member.fullName)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-gray-900 dark:text-white">
                                                {member.fullName}
                                            </p>

                                            <p className="truncate text-[10px] text-gray-400">
                                                {member.email}
                                            </p>
                                        </div>

                                        <div
                                            className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                                                isSelected
                                                    ? "border-violet-600 bg-violet-600"
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                        />
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {error && (
                        <p className="mt-3 text-xs text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !selectedMemberId}
                        className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {isLoading
                            ? "Starting..."
                            : "Start conversation"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateDirectMessageModal;
