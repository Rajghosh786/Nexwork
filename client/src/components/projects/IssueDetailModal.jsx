import { useEffect, useState } from "react";
import { X, Trash2, Send, Clock, User, MessageSquare } from "lucide-react";
import api from "../../services/api";
import { getInitials } from "../../utils/helpers";

const IssueDetailModal = ({
    issue,
    workspaceId,
    projectId,
    projectMembers,
    isProjectAdmin,
    onClose,
    onIssueUpdated,
    onIssueDeleted
}) => {
    const [details, setDetails] = useState(issue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Edit state
    const [isSaving, setIsSaving] = useState(false);
    
    // Comment state
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchIssueDetails = async () => {
            try {
                const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/issues/${issue._id}`);
                setDetails(response.data);
            } catch (err) {
                console.error("Failed to load issue:", err);
                setError("Unable to load full issue details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssueDetails();
    }, [workspaceId, projectId, issue._id]);

    const handleUpdateField = async (field, value) => {
        try {
            setIsSaving(true);
            const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/issues/${issue._id}`, {
                [field]: value === "" ? null : value
            });
            
            const updatedIssue = response.data.issue;
            setDetails(updatedIssue);
            onIssueUpdated(updatedIssue);
        } catch (err) {
            console.error(`Failed to update ${field}:`, err);
            // Revert might be needed here ideally, but for simple UI we just show error or log
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this issue?")) return;
        
        try {
            setIsSaving(true);
            await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/issues/${issue._id}`);
            onIssueDeleted(issue._id);
        } catch (err) {
            console.error("Failed to delete issue:", err);
            setError("Unable to delete issue.");
            setIsSaving(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setIsSubmittingComment(true);
            const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/issues/${issue._id}/comments`, {
                text: commentText.trim()
            });
            
            // Append new comment to details
            setDetails(prev => ({
                ...prev,
                comments: [...prev.comments, response.data.comment]
            }));
            
            // Also notify parent so board card can update comment count
            onIssueUpdated({
                ...details,
                comments: [...details.comments, response.data.comment]
            });
            
            setCommentText("");
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-[#1c1c21]">
                    <p className="text-sm text-gray-400">Loading issue details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex w-full max-w-4xl flex-col max-h-[90vh] rounded-2xl bg-white shadow-2xl dark:bg-[#1c1c21] overflow-hidden">
                {/* Header */}
                <div className="shrink-0 border-b border-gray-100 p-5 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Issue Details</span>
                        {error && <span className="text-[10px] text-red-500">{error}</span>}
                        {isSaving && <span className="text-[10px] text-violet-500">Saving...</span>}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {isProjectAdmin && (
                            <button
                                onClick={handleDelete}
                                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"
                                title="Delete Issue"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:border-r border-gray-100 dark:border-gray-800">
                        {/* Title input (inline edit) */}
                        <input
                            type="text"
                            value={details.title}
                            onChange={(e) => setDetails({...details, title: e.target.value})}
                            onBlur={(e) => {
                                if (e.target.value !== issue.title) {
                                    handleUpdateField("title", e.target.value);
                                }
                            }}
                            className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-gray-300 focus:border-b focus:border-violet-500 dark:text-white"
                            placeholder="Issue title"
                        />

                        <div className="mt-6">
                            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                            <textarea
                                value={details.description || ""}
                                onChange={(e) => setDetails({...details, description: e.target.value})}
                                onBlur={(e) => {
                                    if (e.target.value !== (issue.description || "")) {
                                        handleUpdateField("description", e.target.value);
                                    }
                                }}
                                rows={6}
                                placeholder="Add a description..."
                                className="w-full resize-y rounded-lg border border-transparent bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:bg-white dark:bg-[#151519] dark:focus:border-violet-700 dark:focus:bg-[#1c1c21]"
                            />
                        </div>

                        {/* Comments Section */}
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Comments</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                {details.comments?.length === 0 ? (
                                    <p className="text-xs text-gray-400">No comments yet.</p>
                                ) : (
                                    details.comments?.map(comment => (
                                        <div key={comment._id} className="flex gap-3">
                                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-200 text-[10px] font-bold dark:bg-gray-700">
                                                {getInitials(comment.author?.fullName || "U")}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xs font-bold">{comment.author?.fullName}</span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="mt-1 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-[#151519]">
                                                    {comment.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleAddComment} className="flex gap-3">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-gray-700 dark:bg-[#1c1c21]"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmittingComment}
                                    className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-violet-700"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Attributes */}
                    <div className="w-full md:w-64 shrink-0 bg-gray-50 p-6 dark:bg-[#151519] overflow-y-auto space-y-6">
                        
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</label>
                            <select
                                value={details.status}
                                onChange={(e) => handleUpdateField("status", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REVIEW">Review</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Priority</label>
                            <select
                                value={details.priority}
                                onChange={(e) => handleUpdateField("priority", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
                            >
                                <option value="NONE">None</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Assignee</label>
                            <select
                                value={details.assignee?._id || details.assignee || ""}
                                onChange={(e) => handleUpdateField("assignee", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
                            >
                                <option value="">Unassigned</option>
                                {projectMembers.map(member => (
                                    <option key={member.user._id || member.user.id} value={member.user._id || member.user.id}>
                                        {member.user.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Due Date</label>
                            <input
                                type="date"
                                value={details.dueDate ? new Date(details.dueDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => handleUpdateField("dueDate", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <User className="h-3.5 w-3.5" />
                                <span>Reporter: {details.reporter?.fullName || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Created {new Date(details.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailModal;
