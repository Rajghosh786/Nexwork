import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, description, footerText, footerLinkText, footerLink }) => {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
                <div className="w-full">
                    <div className="mb-8 text-center">
                        <Link
                            to="/"
                            className="text-2xl font-bold tracking-tight text-slate-900"
                        >
                            WorkSpace
                        </Link>

                        <h1 className="mt-8 text-2xl font-semibold text-slate-900">
                            {title}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {description}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        {children}
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        {footerText}{" "}
                        <Link
                            to={footerLink}
                            className="font-medium text-slate-900 hover:underline"
                        >
                            {footerLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default AuthLayout;