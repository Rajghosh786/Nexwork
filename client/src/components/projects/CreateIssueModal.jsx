import { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

const CreateIssueModal = ({
    workspaceId,
    projectId,
    projectMembers,
    onClose,
    onIssueCreated,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");
    const [priority, setPriority] = useState("NONE");
    const [assignee, setAssignee] = useState("");
    const [dueDate, setDueDate] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Issue title is required");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const payload = {
                title: title.trim(),
                description: description.trim(),
                status,
                priority,
            };

            if (assignee) {
                payload.assignee = assignee;
            }

            if (dueDate) {
                payload.dueDate = dueDate;
            }

            const response = await api.post(
                `/workspaces/${workspaceId}/projects/${projectId}/issues`,
                payload
            );

            onIssueCreated(response.data.issue);
            onClose();
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                    "Unable to create issue"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21] my-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Create an issue</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief summary of the task..."
                            className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={4}
                            className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-gray-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REVIEW">Review</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
                            >
                                <option value="NONE">None</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                                Assignee
                            </label>
                            <select
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-[#1c1c21]"
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
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-gray-700"
                            />
                        </div>
                    </div>

                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-violet-700"
                        >
                            {isLoading ? "Creating..." : "Create issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIssueModal;
