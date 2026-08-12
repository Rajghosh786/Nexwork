import { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

const EditProjectModal = ({
    workspaceId,
    projectId,
    project,
    onClose,
    onProjectUpdated,
}) => {
    const [name, setName] = useState(project.name || "");
    const [description, setDescription] = useState(project.description || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await api.patch(
                `/workspaces/${workspaceId}/projects/${projectId}`,
                {
                    name: name.trim(),
                    description: description.trim(),
                }
            );

            onProjectUpdated(response.data.project);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to update project"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Edit Project
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                            Project Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                            className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-500 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a project description..."
                            rows={4}
                            className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-500 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500">
                            {error}
                        </p>
                    )}

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
                            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;