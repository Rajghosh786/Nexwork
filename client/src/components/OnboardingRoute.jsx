import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OnboardingRoute = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">
                    Loading...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.onboardingCompleted) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default OnboardingRoute;