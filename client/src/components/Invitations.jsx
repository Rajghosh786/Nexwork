import { useEffect, useState } from "react";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
    const { socket } = useSocket();

    const fetchInvitations = async () => {
        try {
            const response = await api.get("/invitations");

            setInvitations(response.data.invitations);
        } catch (error) {
            console.error("Unable to load invitations", error);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    useEffect(() => {
        const handleNewInvitation = (invitation) => {
            setInvitations((current) => [
                invitation,
                ...current,
            ]);
        };

        socket.on("new_invitation", handleNewInvitation);

        return () => {
            socket.off("new_invitation", handleNewInvitation);
        };
    }, [socket]);

    const acceptInvitation = async (id) => {
        try {
            await api.patch(`/invitations/${id}/accept`);

            setInvitations((current) =>
                current.filter((invitation) => invitation._id !== id)
            );
        } catch (error) {
            console.error("Unable to accept invitation", error);
        }
    };

    const rejectInvitation = async (id) => {
        try {
            await api.patch(`/invitations/${id}/reject`);

            setInvitations((current) =>
                current.filter((invitation) => invitation._id !== id)
            );
        } catch (error) {
            console.error("Unable to reject invitation", error);
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-[#1c1c21]">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Invitations
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Invitations to join organizations
                </p>
            </div>

            {invitations.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                    No pending invitations
                </p>
            ) : (
                <div className="space-y-3">
                    {invitations.map((invitation) => (
                        <div
                            key={invitation._id}
                            className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                        >
                            <p className="text-sm font-semibold">
                                {invitation.workspace.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Invited by{" "}
                                {invitation.sender.fullName}
                            </p>

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() =>
                                        acceptInvitation(
                                            invitation._id
                                        )
                                    }
                                    className="flex-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        rejectInvitation(
                                            invitation._id
                                        )
                                    }
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Invitations;