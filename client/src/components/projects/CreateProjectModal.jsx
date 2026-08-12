import { useState } from "react";
import { X } from "lucide-react";

import api from "../../services/api";

const CreateProjectModal = ({
    workspaceId,
    onClose,
    onProjectCreated,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
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

            const response = await api.post(`/workspaces/${workspaceId}/projects`, {
                name: name.trim(),
                description: description.trim(),
            });

            onProjectCreated(response.data.project);
            onClose();
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                    "Unable to create project"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Create a project</h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                        Project name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Website Redesign"
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-gray-700"
                    />

                    <label className="mt-4 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        Description (optional)
                    </label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="What is this project about?"
                        rows={3}
                        className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-gray-700"
                    />

                    {error && (
                        <p className="mt-3 text-xs text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Create project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
