import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { getWorkspaceInitials } from "../utils/helpers";

const WorkspaceSwitcher = ({
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
}) => {
    const [showWorkspaces, setShowWorkspaces] = useState(false);

    const getWorkspaceId = (workspace) => {
        return workspace?.id || workspace?._id;
    };

    const selectedId = getWorkspaceId(selectedWorkspace);

    return (
        <div className="relative px-3 pt-4">
            <button
                onClick={() => setShowWorkspaces(!showWorkspaces)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-600 text-xs font-bold text-white">
                    {selectedWorkspace?.initials ||
                        getWorkspaceInitials(selectedWorkspace?.name)}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                        {selectedWorkspace?.name || "Select workspace"}
                    </p>

                    <p className="text-[10px] text-gray-400">
                        {selectedWorkspace?.role || ""}
                    </p>
                </div>

                <span className="text-gray-400">
                    {showWorkspaces ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </span>
            </button>

            {showWorkspaces && (
                <div className="absolute left-3 right-3 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
                    <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Your Workspaces
                    </p>

                    {workspaces.map((workspace) => {
                        const workspaceId = getWorkspaceId(workspace);

                        return (
                            <button
                                key={workspaceId}
                                onClick={() => {
                                    setSelectedWorkspace(workspace);
                                    setShowWorkspaces(false);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gray-100 text-[9px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    {workspace.initials ||
                                        getWorkspaceInitials(workspace.name)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
                                        {workspace.name}
                                    </p>

                                    <p className="text-[9px] text-gray-400">
                                        {workspace.role}
                                    </p>
                                </div>

                                {selectedId &&
                                    String(workspaceId) ===
                                        String(selectedId) && (
                                        <Check className="h-4 w-4 text-violet-600" />
                                    )}
                            </button>
                        );
                    })}

                    {workspaces.length === 0 && (
                        <p className="px-2 py-3 text-center text-[10px] text-gray-400">
                            No workspaces found
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkspaceSwitcher;
