import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";

const InvitationPanel = ({ onClose, onUpdate }) => {
    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { socket } = useSocket();

    const getInvitations = async () => {
        try {
            const response = await api.get("/invitations");

            setInvitations(response.data.invitations);
        } catch (error) {
            console.error("Unable to load invitations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getInvitations();
    }, []);

    useEffect(() => {
        const handleNewInvitation = (invitation) => {
            setInvitations((current) => {
                const alreadyExists = current.some(
                    (item) => item._id === invitation._id
                );

                if (alreadyExists) {
                    return current;
                }

                return [invitation, ...current];
            });

            if (onUpdate) {
                onUpdate();
            }
        };

        socket.on("new_invitation", handleNewInvitation);

        return () => {
            socket.off("new_invitation", handleNewInvitation);
        };
    }, [socket, onUpdate]);

    const acceptInvitation = async (id) => {
        try {
            await api.patch(`/invitations/${id}/accept`);

            setInvitations((current) =>
                current.filter((item) => item._id !== id)
            );

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Unable to accept invitation", error);
        }
    };

    const rejectInvitation = async (id) => {
        try {
            await api.patch(`/invitations/${id}/reject`);

            setInvitations((current) =>
                current.filter((item) => item._id !== id)
            );

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Unable to reject invitation", error);
        }
    };

    return (
        <div className="absolute right-0 top-11 z-50 w-[340px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#1c1c21]">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Invitations
                    </h3>

                    <p className="mt-0.5 text-[11px] text-gray-400">
                        Organization invitations
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto p-2">
                {isLoading ? (
                    <p className="p-5 text-center text-xs text-gray-400">
                        Loading invitations...
                    </p>
                ) : invitations.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Check className="h-5 w-5 text-gray-400" />
                        </div>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            No pending invitations
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            You're all caught up.
                        </p>
                    </div>
                ) : (
                    invitations.map((invitation) => (
                        <div
                            key={invitation._id}
                            className="rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-start gap-3">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                    {invitation.workspace?.name
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                        {invitation.workspace?.name}
                                    </p>

                                    <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                                        {invitation.sender?.fullName} invited
                                        you to join this organization.
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() =>
                                                acceptInvitation(
                                                    invitation._id
                                                )
                                            }
                                            className="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                rejectInvitation(
                                                    invitation._id
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InvitationPanel;
