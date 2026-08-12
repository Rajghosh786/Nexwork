import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import api from "../services/api";
import { getInitials } from "../utils/helpers";

const OrganizationMembersModal = ({
    workspaceId,
    onClose,
}) => {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await api.get(
                    `/workspaces/${workspaceId}/members`
                );

                setMembers(response.data.members || []);
            } catch (error) {
                console.error(
                    "Failed to fetch workspace members:",
                    error
                );

                setError("Unable to load members.");
            } finally {
                setIsLoading(false);
            }
        };

        if (workspaceId) {
            fetchMembers();
        }
    }, [workspaceId]);

    const filteredMembers = members.filter((member) => {
        const name = member.user?.fullName || "";
        const email = member.user?.email || "";
        const searchValue = search.toLowerCase().trim();

        return (
            name.toLowerCase().includes(searchValue) ||
            email.toLowerCase().includes(searchValue)
        );
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-[#1c1c21]">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                    <div>
                        <h2 className="text-sm font-semibold">
                            Organization Members
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                            {members.length}{" "}
                            {members.length === 1
                                ? "member"
                                : "members"}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 dark:border-gray-700">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search members..."
                            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-xs text-gray-400">
                                Loading members...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-xs text-red-500">
                                {error}
                            </p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-xs text-gray-400">
                                {search
                                    ? "No members found."
                                    : "No members yet."}
                            </p>
                        </div>
                    ) : (
                        filteredMembers.map((member) => {
                            const user = member.user;

                            return (
                                <div
                                    key={user?._id || member._id}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                >
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                                        {getInitials(
                                            user?.fullName || "User"
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {user?.fullName || "Unknown user"}
                                        </p>

                                        {user?.email && (
                                            <p className="truncate text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizationMembersModal;