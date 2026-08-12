import { useEffect, useState } from "react";
import { Plus, FolderDot, Archive, Trash2, ArchiveRestore} from "lucide-react";
import api from "../../services/api";
import CreateProjectModal from "./CreateProjectModal";

const ProjectsList = ({ workspaceId, onSelectProject }) => {
    const [projects, setProjects] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchProjects = async () => {
        if (!workspaceId) return;

        try {
            setIsLoading(true);
            setError("");

            const response = await api.get(
                `/workspaces/${workspaceId}/projects`,
                {
                    params: {
                        archived: showArchived
                    }
                }
            );

            setProjects(response.data || []);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Unable to load projects. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchiveProject = async (projectId) => {
        try {
            await api.delete(
                `/workspaces/${workspaceId}/projects/${projectId}/archive`
            );

            setProjects((current) =>
                current.filter((project) => project._id !== projectId)
            );
        } catch (error) {
            console.error("Failed to archive project:", error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this project? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            await api.delete(
                `/workspaces/${workspaceId}/projects/${projectId}`
            );

            setProjects((current) =>
                current.filter((project) => project._id !== projectId)
            );
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };


    const handleUnarchiveProject = async (projectId) => {
        try {
            await api.patch(
                `/workspaces/${workspaceId}/projects/${projectId}/unarchive`
            );

            setProjects((current) =>
                current.filter((project) => project._id !== projectId)
            );
        } catch (error) {
            console.error("Failed to unarchive project:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [workspaceId, showArchived]);

    const handleProjectCreated = (newProject) => {
        setProjects((prev) => [...prev, newProject]);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p className="text-sm text-gray-400">Loading projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                        Projects
                    </h1>
                    <p className="mt-1 text-xs text-gray-400">
                        Manage your organization's projects and tasks.
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowArchived((current) => !current)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        {showArchived ? (
                            <>
                                <ArchiveRestore className="h-4 w-4" />
                                <span>Active Projects</span>
                            </>
                        ) : (
                            <>
                                <Archive className="h-4 w-4" />
                                <span>Archived</span>
                            </>
                        )}
                    </button>

                    {!showArchived && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">New Project</span>
                        </button>
                    )}
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-[#1c1c21]">
                    {showArchived ? (
                        <>
                            <Archive className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />

                            <h2 className="text-sm font-semibold">
                                No archived projects
                            </h2>

                            <p className="mt-2 max-w-sm text-xs text-gray-400">
                                There are no archived projects in this organization.
                            </p>
                        </>
                    ) : (
                        <>
                            <FolderDot className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />

                            <h2 className="text-sm font-semibold">
                                No projects found
                            </h2>

                            <p className="mt-2 max-w-sm text-xs text-gray-400">
                                You don't have any active projects in this workspace,
                                or you don't have access to them. Create one to get started.
                            </p>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                            >
                                Create your first project
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => onSelectProject(project)}
                            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-gray-800 dark:bg-[#1c1c21] dark:hover:border-violet-900"
                        >
                        <div className="flex items-start justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                                <FolderDot className="h-5 w-5" />
                            </div>

                            <div className="flex items-center gap-1">
                                {showArchived ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnarchiveProject(project._id);
                                        }}
                                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10"
                                        title="Unarchive Project"
                                    >
                                        <ArchiveRestore className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleArchiveProject(project._id);
                                        }}
                                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-500/10"
                                        title="Archive Project"
                                    >
                                        <Archive className="h-4 w-4" />
                                    </button>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProject(project._id);
                                    }}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                    title="Delete Project"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>

                                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {project.members?.length || 0} members
                                </span>
                            </div>
                        </div>

                            <h3 className="mt-4 truncate text-sm font-bold">
                                {project.name}
                            </h3>
                            
                            <p className="mt-1 line-clamp-2 text-xs text-gray-400 min-h-[32px]">
                                {project.description || "No description provided."}
                            </p>

                            <div className="mt-5 border-t border-gray-100 pt-4 flex items-center justify-between text-[10px] text-gray-400 dark:border-gray-800">
                                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                <span className="font-medium text-violet-600 dark:text-violet-400 opacity-0 transition group-hover:opacity-100">
                                    View project →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <CreateProjectModal
                    workspaceId={workspaceId}
                    onClose={() => setShowCreateModal(false)}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </div>
    );
};

export default ProjectsList;
