import { useState } from "react";
import { getInitials } from "../../utils/helpers";
import { MessageSquare } from "lucide-react";

const priorityConfig = {
    NONE: { color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", label: "None" },
    LOW: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400", label: "Low" },
    MEDIUM: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400", label: "Medium" },
    HIGH: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400", label: "High" },
    URGENT: { color: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400", label: "Urgent" }
};

const IssueCard = ({ issue, onClick, onDragStart, onDragEnd }) => {
    const priority = priorityConfig[issue.priority] || priorityConfig.NONE;
    const isOverdue = issue.dueDate && new Date(issue.dueDate) < new Date();

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, issue)}
            onDragEnd={onDragEnd}
            onClick={() => onClick(issue)}
            className="group relative cursor-grab rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-violet-300 hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-[#1c1c21] dark:hover:border-violet-900"
        >
            <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-snug text-gray-900 dark:text-white line-clamp-2">
                    {issue.title}
                </h4>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                {issue.priority !== "NONE" && (
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priority.color}`}>
                        {priority.label}
                    </span>
                )}
                
                {issue.dueDate && (
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {new Date(issue.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium">{issue.comments?.length || 0}</span>
                </div>

                {issue.assignee ? (
                    <div 
                        className="grid h-6 w-6 place-items-center rounded-full bg-violet-100 text-[9px] font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                        title={`Assigned to ${issue.assignee.fullName}`}
                    >
                        {getInitials(issue.assignee.fullName)}
                    </div>
                ) : (
                    <div className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-gray-300 text-[10px] text-gray-400 dark:border-gray-600">
                        ?
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueCard;
