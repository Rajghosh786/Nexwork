export const getInitials = (name) => {
    if (!name) {
        return "U";
    }

    const words = name.trim().split(" ");

    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
};

export const getWorkspaceInitials = (name) => {
    return getInitials(name);
};

export const formatWorkspace = (workspace) => {
    return {
        ...workspace,
        initials: getWorkspaceInitials(workspace.name),
    };
};

export const formatTime = (dateString) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};
