import { useEffect, useState } from "react";
import { Settings, Users, Plus, Archive, Edit2, Trash2 } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ProjectMembersModal from "./ProjectMembersModal";
import IssueBoard from "./IssueBoard";
import CreateIssueModal from "./CreateIssueModal";
import EditProjectModal from "./EditProjectModal";

const ProjectDetail = ({ workspaceId, projectId, onBack }) => {
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);

    const [showProjectSettings, setShowProjectSettings] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);

    // Derived permissions
    const [isProjectAdmin, setIsProjectAdmin] = useState(false);

    const fetchProjectData = async () => {
        try {
            setIsLoading(true);
            setError("");
            
            const [projectRes, issuesRes, membershipRes] = await Promise.all([
                api.get(`/workspaces/${workspaceId}/projects/${projectId}`),
                api.get(`/workspaces/${workspaceId}/projects/${projectId}/issues`),
                // api.get(`/workspaces/${workspaceId}/members`)
            ]);

            const projectData = projectRes.data;
            setProject(projectData);
            setIssues(issuesRes.data || []);

            // Check if user is org admin
            const projectMember = projectData.members?.find(
                m => m.user?._id === user?.id || m.user?._id === user?._id
            );

            setIsProjectAdmin(projectMember?.role === "PROJECT_ADMIN");

        } catch (err) {
            console.error("Failed to load project details:", err);
            setError("Unable to load project details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchiveProject = async () => {
        try {
            await api.delete(
                `/workspaces/${workspaceId}/projects/${projectId}/archive`
            );

            onBack?.();
        } catch (error) {
            console.error("Failed to archive project:", error);
        }
    };

    const handleDeleteProject = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this project? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/workspaces/${workspaceId}/projects/${projectId}`
            );

            onBack?.();
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    useEffect(() => {
        if (workspaceId && projectId) {
            fetchProjectData();
        }
    }, [workspaceId, projectId, user]);

    const handleMembersUpdated = (updatedMembers) => {
        setProject(prev => ({ ...prev, members: updatedMembers }));
    };

    const handleProjectUpdated = (updatedProject) => {
        setProject(prev => ({
            ...prev,
            ...updatedProject,
            members: prev.members,
        }));
    };

    const handleIssueCreated = (newIssue) => {
        setIssues(prev => [newIssue, ...prev]);
    };

    const handleIssueUpdated = (updatedIssue) => {
        setIssues(prev => prev.map(issue => 
            issue._id === updatedIssue._id ? updatedIssue : issue
        ));
    };

    const handleIssueDeleted = (issueId) => {
        setIssues(prev => prev.filter(issue => issue._id !== issueId));
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p className="text-sm text-gray-400">Loading project...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-sm text-red-500 mb-4">{error || "Project not found"}</p>
                    {onBack && (
                        <button onClick={onBack} className="text-sm text-violet-600 hover:underline">
                            Go back
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-[#1c1c21]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                            {project.name}
                        </h1>
                        <p className="mt-1 text-xs text-gray-500 max-w-2xl">
                            {project.description || "No description provided."}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setShowMembersModal(true)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <Users className="h-3.5 w-3.5" />
                            <span>{project.members?.length || 0} Members</span>
                        </button>
                        
                        <button
                            onClick={() => setShowCreateIssueModal(true)}
                            className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>New Issue</span>
                        </button>

                        {isProjectAdmin && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProjectSettings((current) => !current)}
                                    className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                    title="Project Settings"
                                >
                                    <Settings className="h-4 w-4" />
                                </button>

                                {showProjectSettings && (
                                    <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-[#1c1c21]">
                                        <button
                                            onClick={() => {
                                                setShowProjectSettings(false);
                                                setShowEditProjectModal(true);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit Project
                                        </button>

                                        <button
                                            onClick={handleArchiveProject}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            <Archive className="h-4 w-4" />
                                            Archive Project
                                        </button>

                                        <button
                                            onClick={handleDeleteProject}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Project
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">
                <IssueBoard 
                    issues={issues}
                    workspaceId={workspaceId}
                    projectId={projectId}
                    projectMembers={project.members}
                    isProjectAdmin={isProjectAdmin}
                    onIssueUpdated={handleIssueUpdated}
                    onIssueDeleted={handleIssueDeleted}
                />
            </div>

            {showMembersModal && (
                <ProjectMembersModal
                    workspaceId={workspaceId}
                    projectId={projectId}
                    projectMembers={project.members}
                    isProjectAdmin={isProjectAdmin}
                    onClose={() => setShowMembersModal(false)}
                    onMembersUpdated={handleMembersUpdated}
                />
            )}

            {showCreateIssueModal && (
                <CreateIssueModal
                    workspaceId={workspaceId}
                    projectId={projectId}
                    projectMembers={project.members}
                    onClose={() => setShowCreateIssueModal(false)}
                    onIssueCreated={handleIssueCreated}
                />
            )}

            {showEditProjectModal && (
                <EditProjectModal
                    workspaceId={workspaceId}
                    projectId={projectId}
                    project={project}
                    onClose={() => setShowEditProjectModal(false)}
                    onProjectUpdated={handleProjectUpdated}
                />
            )}
        </div>
    );
};

export default ProjectDetail;
