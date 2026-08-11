import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./components/Dashboard";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import OnboardingRoute from "./components/OnboardingRoute";
import OrganizationSetup from "./pages/OrganizationSetup";
import PlanSelection from "./pages/PlanSelection";
import OrganizationPayment from "./pages/OrganizationPayment";

const App = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            <Route
                path="/onboarding"
                element={
                    <OnboardingRoute>
                        <Onboarding />
                    </OnboardingRoute>
                }
            />

            <Route
                path="/onboarding/organization"
                element={
                    <OnboardingRoute>
                        <OrganizationSetup />
                    </OnboardingRoute>
                }
            />

            <Route
                path="/onboarding/organization/plan"
                element={
                    <OnboardingRoute>
                        <PlanSelection />
                    </OnboardingRoute>
                }
            />

            <Route
                path="/onboarding/organization/payment"
                element={
                    <OnboardingRoute>
                        <OrganizationPayment />
                    </OnboardingRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
};

export default App;