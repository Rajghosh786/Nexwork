import { useEffect, useState } from "react";
import { Search, X, Shield, User as UserIcon } from "lucide-react";
import api from "../../services/api";
import { getInitials } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

const ProjectMembersModal = ({
    workspaceId,
    projectId,
    projectMembers,
    isProjectAdmin,
    onClose,
    onMembersUpdated,
}) => {
    const { user } = useAuth();
    const [workspaceMembers, setWorkspaceMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("current"); // "current" | "add"

    useEffect(() => {
        const fetchWorkspaceMembers = async () => {
            if (!isProjectAdmin) return;
            try {
                const response = await api.get(`/workspaces/${workspaceId}/members`);
                setWorkspaceMembers(response.data || []);
            } catch (err) {
                console.error("Failed to fetch workspace members:", err);
            }
        };

        if (activeTab === "add") {
            fetchWorkspaceMembers();
        }
    }, [workspaceId, isProjectAdmin, activeTab]);

    const handleAddMember = async (userId, role) => {
        try {
            setIsLoading(true);
            setError("");
            
            const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/members`, {
                userId,
                role
            });
            
            onMembersUpdated(response.data.project.members);
        } catch (submitError) {
            setError(submitError.response?.data?.message || "Unable to add member");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            setIsLoading(true);
            setError("");
            
            const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`);
            
            onMembersUpdated(response.data.project.members);
        } catch (submitError) {
            setError(submitError.response?.data?.message || "Unable to remove member");
        } finally {
            setIsLoading(false);
        }
    };

    const currentMemberIds = projectMembers.map(m => m.user._id || m.user.id);
    
    const availableMembers = workspaceMembers.filter(
        m => m.user && !currentMemberIds.includes(m.user._id || m.user.id) &&
        (m.user.fullName?.toLowerCase().includes(search.toLowerCase()) || m.user.email?.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredCurrentMembers = projectMembers.filter(m => 
        m.user?.fullName?.toLowerCase().includes(search.toLowerCase()) || 
        m.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#1c1c21] max-h-[80vh]">
                <div className="shrink-0 p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Project Members</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {isProjectAdmin && (
                        <div className="mt-4 flex gap-4 border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => { setActiveTab("current"); setSearch(""); setError(""); }}
                                className={`pb-2 text-xs font-medium transition ${activeTab === "current" ? "border-b-2 border-violet-600 text-violet-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                            >
                                Current Members
                            </button>
                            <button
                                onClick={() => { setActiveTab("add"); setSearch(""); setError(""); }}
                                className={`pb-2 text-xs font-medium transition ${activeTab === "add" ? "border-b-2 border-violet-600 text-violet-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                            >
                                Add People
                            </button>
                        </div>
                    )}

                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search members..."
                            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-9 pr-3 text-xs outline-none focus:border-violet-500 dark:border-gray-700 dark:focus:border-violet-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {error && (
                        <div className="mx-3 my-2 rounded-lg bg-red-50 p-2 text-[10px] text-red-600 dark:bg-red-950/50 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {activeTab === "current" ? (
                        <div className="space-y-1">
                            {filteredCurrentMembers.length === 0 ? (
                                <p className="p-4 text-center text-xs text-gray-500">No members found.</p>
                            ) : (
                                filteredCurrentMembers.map((member) => (
                                    <div key={member.user._id || member.user.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-200 text-[10px] font-bold dark:bg-gray-700">
                                                {getInitials(member.user.fullName)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                    {member.user.fullName}
                                                    {member.role === "PROJECT_ADMIN" && (
                                                        <Shield className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                                                    )}
                                                </p>
                                                <p className="truncate text-[10px] text-gray-500">{member.user.email}</p>
                                            </div>
                                        </div>
                                        
                                        {isProjectAdmin && member.user._id !== user?.id && (
                                            <button
                                                onClick={() => handleRemoveMember(member.user._id || member.user.id)}
                                                disabled={isLoading}
                                                className="shrink-0 rounded px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/50"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {availableMembers.length === 0 ? (
                                <p className="p-4 text-center text-xs text-gray-500">No available members to add.</p>
                            ) : (
                                availableMembers.map((member) => (
                                    <div key={member.user._id || member.user.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-200 text-[10px] font-bold dark:bg-gray-700">
                                                {getInitials(member.user.fullName)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                                                    {member.user.fullName}
                                                </p>
                                                <p className="truncate text-[10px] text-gray-500">{member.user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleAddMember(member.user._id || member.user.id, "MEMBER")}
                                                disabled={isLoading}
                                                className="rounded border border-gray-200 px-2 py-1 text-[10px] font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                            >
                                                Add Member
                                            </button>
                                            <button
                                                onClick={() => handleAddMember(member.user._id || member.user.id, "PROJECT_ADMIN")}
                                                disabled={isLoading}
                                                className="rounded bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-50 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50"
                                            >
                                                Make Admin
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectMembersModal;
