import { useState } from "react";
import IssueCard from "./IssueCard";
import IssueDetailModal from "./IssueDetailModal";
import api from "../../services/api";

const COLUMNS = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "REVIEW", title: "Review" },
    { id: "DONE", title: "Done" }
];

const IssueBoard = ({ issues, workspaceId, projectId, projectMembers, isProjectAdmin, onIssueUpdated, onIssueDeleted }) => {
    const [draggedIssue, setDraggedIssue] = useState(null);
    const [draggedOverColumn, setDraggedOverColumn] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e, issue) => {
        setDraggedIssue(issue);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            e.target.style.opacity = "0.5";
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = "1";
        setDraggedIssue(null);
        setDraggedOverColumn(null);
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (draggedOverColumn !== columnId) {
            setDraggedOverColumn(columnId);
        }
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        if (!draggedIssue) return;
        if (draggedIssue.status === targetStatus) {
            setDraggedOverColumn(null);
            return;
        }

        const originalIssue = { ...draggedIssue };
        
        // Optimistic update
        onIssueUpdated({ ...draggedIssue, status: targetStatus });
        setDraggedOverColumn(null);

        try {
            const response = await api.patch(
                `/workspaces/${workspaceId}/projects/${projectId}/issues/${draggedIssue._id}`,
                { status: targetStatus }
            );
            onIssueUpdated(response.data.issue);
        } catch (error) {
            console.error("Failed to update issue status:", error);
            // Revert on failure
            onIssueUpdated(originalIssue);
        }
    };

    return (
        <div className="flex h-full items-start gap-4 pb-4">
            {COLUMNS.map((column) => {
                const columnIssues = issues.filter(issue => issue.status === column.id && !issue.archived);
                const isOver = draggedOverColumn === column.id;

                return (
                    <div
                        key={column.id}
                        className={`flex h-full w-[280px] shrink-0 flex-col rounded-2xl border border-gray-200 bg-gray-100 p-3 transition-colors dark:border-gray-700 dark:bg-[#151519] ${
                            isOver ? "ring-2 ring-violet-500/50" : ""
                        }`}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <div className="mb-3 flex items-center justify-between px-1">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {column.title}
                            </h3>
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                {columnIssues.length}
                            </span>
                        </div>

                        <div className="flex-1 min-h-[100px] space-y-3 overflow-y-auto">
                            {columnIssues.map((issue) => (
                                <IssueCard
                                    key={issue._id}
                                    issue={issue}
                                    onClick={setSelectedIssue}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    workspaceId={workspaceId}
                    projectId={projectId}
                    projectMembers={projectMembers}
                    isProjectAdmin={isProjectAdmin}
                    onClose={() => setSelectedIssue(null)}
                    onIssueUpdated={onIssueUpdated}
                    onIssueDeleted={(id) => {
                        onIssueDeleted(id);
                        setSelectedIssue(null);
                    }}
                />
            )}
        </div>
    );
};

export default IssueBoard;
