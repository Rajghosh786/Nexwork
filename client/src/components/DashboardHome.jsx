const DashboardHome = ({
    displayName,
    selectedWorkspace,
    workspaces,
    invitationCount,
}) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <p className="text-xs text-gray-400">Your workspace</p>

                <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                    Welcome back, {displayName}!
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                    Here's what's happening in{" "}
                    {selectedWorkspace?.name || "your workspace"}.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1c1c21]">
                    <p className="text-xs font-medium text-gray-400">
                        Workspace
                    </p>

                    <p className="mt-3 truncate text-xl font-semibold">
                        {selectedWorkspace?.name || "No workspace selected"}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-400">
                        {selectedWorkspace?.type || "PERSONAL"} ·{" "}
                        {selectedWorkspace?.role || "MEMBER"}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1c1c21]">
                    <p className="text-xs font-medium text-gray-400">
                        Your Workspaces
                    </p>

                    <p className="mt-3 text-3xl font-semibold">
                        {workspaces.length}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-400">
                        Total workspaces you belong to
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1c1c21]">
                    <p className="text-xs font-medium text-gray-400">
                        Pending Invitations
                    </p>

                    <p className="mt-3 text-3xl font-semibold">
                        {invitationCount}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-400">
                        Organization invitations
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-[#1c1c21]">
                <h2 className="text-sm font-semibold">Tasks & Projects</h2>

                <p className="mt-2 text-xs text-gray-400">
                    No tasks or projects yet.
                </p>
            </div>
        </div>
    );
};

export default DashboardHome;
