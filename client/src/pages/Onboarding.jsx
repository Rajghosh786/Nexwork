import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Onboarding = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    const [accountType, setAccountType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleContinue = async () => {
        if (!accountType) {
            setError("Please select an option.");
            return;
        }

        setError("");

        if (accountType === "ORGANIZATION") {
            navigate("/onboarding/organization");
            return;
        }

        try {
            setIsLoading(true);

            await api.post("/onboarding/complete", {
                accountType: "PERSONAL",
            });

            await refreshUser();

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to complete onboarding"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Welcome, {user?.fullName}
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                            Let's set up your account
                        </h1>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                            Choose how you want to use the platform. You can
                            always join other organizations later.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="mt-10 grid gap-5 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => {
                                setAccountType("PERSONAL");
                                setError("");
                            }}
                            className={`rounded-2xl border p-6 text-left transition ${
                                accountType === "PERSONAL"
                                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                    : "border-slate-200 hover:border-slate-400"
                            }`}
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                                <span className="text-xl">👤</span>
                            </div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                Personal
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Use the platform for your own work with your
                                personal workspace.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setAccountType("ORGANIZATION");
                                setError("");
                            }}
                            className={`rounded-2xl border p-6 text-left transition ${
                                accountType === "ORGANIZATION"
                                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                    : "border-slate-200 hover:border-slate-400"
                            }`}
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                                <span className="text-xl">🏢</span>
                            </div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                Organization
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Create an organization, choose a plan and
                                invite your team members.
                            </p>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={isLoading || !accountType}
                        className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Please wait..." : "Continue"}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Onboarding;