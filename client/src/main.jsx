import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                <App />
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>
    
);