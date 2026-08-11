import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const plans = [
    {
        name: "BASIC",
        title: "Basic",
        price: "₹499",
        description: "For small teams getting started.",
    },
    {
        name: "PLUS",
        title: "Plus",
        price: "₹999",
        description: "For growing teams that need more.",
    },
    {
        name: "PRO",
        title: "Pro",
        price: "₹1,999",
        description: "For teams that need the complete experience.",
    },
];

const PlanSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const organizationName =
        location.state?.organizationName || "";

    const [selectedPlan, setSelectedPlan] = useState("");
    const [error, setError] = useState("");

    const handleContinue = () => {
        if (!selectedPlan) {
            setError("Please select a plan.");
            return;
        }

        navigate("/onboarding/organization/payment", {
            state: {
                organizationName,
                selectedPlan,
            },
        });
    };

    if (!organizationName) {
        navigate("/onboarding/organization", {
            replace: true,
        });

        return null;
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/onboarding/organization")
                    }
                    className="text-sm text-slate-500 hover:text-slate-900"
                >
                    ← Back
                </button>

                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        Organization setup
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                        Choose your plan
                    </h1>

                    <p className="mt-3 text-sm text-slate-500">
                        Select a plan for {organizationName}.
                    </p>
                </div>

                {error && (
                    <div className="mx-auto mt-6 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {plans.map((plan) => (
                        <button
                            key={plan.name}
                            type="button"
                            onClick={() => {
                                setSelectedPlan(plan.name);
                                setError("");
                            }}
                            className={`rounded-2xl border bg-white p-6 text-left transition ${
                                selectedPlan === plan.name
                                    ? "border-slate-900 ring-1 ring-slate-900"
                                    : "border-slate-200 hover:border-slate-400"
                            }`}
                        >
                            <h2 className="text-lg font-semibold text-slate-900">
                                {plan.title}
                            </h2>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {plan.price}
                                <span className="text-sm font-normal text-slate-500">
                                    /month
                                </span>
                            </p>

                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                {plan.description}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="mx-auto mt-8 max-w-xl">
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!selectedPlan}
                        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Continue to payment
                    </button>
                </div>
            </div>
        </main>
    );
};

export default PlanSelection;