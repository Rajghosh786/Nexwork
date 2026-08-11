import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const OrganizationPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { refreshUser } = useAuth();

    const organizationName =
        location.state?.organizationName || "";

    const selectedPlan =
        location.state?.selectedPlan || "";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        if (!organizationName || !selectedPlan) {
            navigate("/onboarding/organization", {
                replace: true,
            });

            return;
        }

        try {
            setIsLoading(true);
            setError("");

            /*
             * Dummy Razorpay payment.
             * We will replace this with the real payment flow
             * if required later.
             */
            const paymentSuccessful = true;

            if (!paymentSuccessful) {
                setError("Payment was not successful.");
                return;
            }

            await api.post("/onboarding/organization", {
                organizationName,
                subscriptionPlan: selectedPlan,
            });

            await refreshUser();

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to create organization"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/onboarding/organization/plan",
                                {
                                    state: {
                                        organizationName,
                                    },
                                }
                            )
                        }
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        ← Back
                    </button>

                    <div className="mt-8">
                        <p className="text-sm font-medium text-slate-500">
                            Payment
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                            Complete your subscription
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            You selected the{" "}
                            <span className="font-medium text-slate-900">
                                {selectedPlan}
                            </span>{" "}
                            plan for{" "}
                            <span className="font-medium text-slate-900">
                                {organizationName}
                            </span>
                            .
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-medium text-slate-900">
                            Dummy Razorpay Payment
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This is a test payment. No real money will be
                            charged.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading
                            ? "Creating organization..."
                            : "Pay and create organization"}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default OrganizationPayment;