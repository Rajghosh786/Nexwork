import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrganizationSetup = () => {
    const navigate = useNavigate();

    const [organizationName, setOrganizationName] = useState("");
    const [error, setError] = useState("");

    const handleContinue = (event) => {
        event.preventDefault();

        if (!organizationName.trim()) {
            setError("Organization name is required.");
            return;
        }

        setError("");

        navigate("/onboarding/organization/plan", {
            state: {
                organizationName: organizationName.trim(),
            },
        });
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <button
                        type="button"
                        onClick={() => navigate("/onboarding")}
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        ← Back
                    </button>

                    <div className="mt-8">
                        <p className="text-sm font-medium text-slate-500">
                            Organization setup
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                            Create your organization
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            You will become the admin of this organization
                            and can invite members after setup.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleContinue}
                        className="mt-8"
                    >
                        <label
                            htmlFor="organizationName"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Organization name
                        </label>

                        <input
                            id="organizationName"
                            type="text"
                            value={organizationName}
                            onChange={(event) =>
                                setOrganizationName(event.target.value)
                            }
                            placeholder="Enter organization name"
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        />

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default OrganizationSetup;