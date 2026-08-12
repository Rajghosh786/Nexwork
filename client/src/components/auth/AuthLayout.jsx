import { ArrowLeft, Layers3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({
    title,
    description,
    children,
    footerText,
    footerLinkText,
    footerLink,
}) => {
    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 dark:bg-[#0d0d11] dark:text-white">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

                {/* LEFT VISUAL PANEL */}
                <div className="relative hidden overflow-hidden bg-[#111116] lg:flex">
                    {/* Background glow */}
                    <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
                    <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[120px]" />

                    {/* Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />

                    {/* Decorative gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.08] via-transparent to-transparent" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="group inline-flex w-fit items-center gap-2"
                        >
                            {/* <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 transition group-hover:scale-105">
                                <Sparkles className="h-4 w-4" />
                            </div> */}
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 shadow-sm shadow-violet-600/20">
                            <Layers3 className="h-4 w-4 text-white" />
                        </div>
                            <span className="text-sm font-bold tracking-tight text-white">
                                Nexwork
                            </span>
                        </Link>

                        {/* Main visual */}
                        <div className="relative max-w-xl">

                            {/* Floating card */}
                            <div className="absolute -right-4 -top-20 hidden w-52 rotate-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl xl:block">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-[10px] font-medium text-white/50">
                                        Project progress
                                    </span>

                                    <span className="rounded-full bg-violet-500/20 px-2 py-1 text-[9px] font-semibold text-violet-300">
                                        84%
                                    </span>
                                </div>

                                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full w-[84%] rounded-full bg-violet-500" />
                                </div>

                                <div className="mt-3 flex items-center justify-between text-[9px] text-white/40">
                                    <span>12 tasks</span>
                                    <span>3 remaining</span>
                                </div>
                            </div>

                            {/* Main heading */}
                            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                                Work better together
                            </p>

                            <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
                                Everything your team needs,
                                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    {" "}in one place.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-md text-sm leading-7 text-white/45">
                                Bring conversations, projects, tasks and
                                collaboration together in one simple
                                workspace built for modern teams.
                            </p>

                            {/* Mini stats */}
                            <div className="mt-10 flex items-center gap-8">
                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        24/7
                                    </p>
                                    <p className="mt-1 text-[10px] text-white/35">
                                        Team collaboration
                                    </p>
                                </div>

                                <div className="h-8 w-px bg-white/10" />

                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        One
                                    </p>
                                    <p className="mt-1 text-[10px] text-white/35">
                                        Connected workspace
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom */}
                        <p className="text-[10px] text-white/25">
                            © {new Date().getFullYear()} Nexwork. Built for
                            teams that want to move forward.
                        </p>
                    </div>
                </div>

                {/* RIGHT AUTH PANEL */}
                <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">

                    {/* Mobile background effects */}
                    <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-500/10 blur-[100px] lg:hidden" />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[100px] lg:hidden" />

                    <div className="relative z-10 w-full max-w-[420px]">

                        {/* Mobile logo */}
                        <div className="mb-10 flex items-center justify-between lg:hidden">
                            <Link
                                to="/"
                                className="flex items-center gap-2"
                            >
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-white">
                                    <Sparkles className="h-4 w-4" />
                                </div>

                                <span className="text-sm font-bold tracking-tight">
                                    Nexwork
                                </span>
                            </Link>

                            <Link
                                to="/"
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Home
                            </Link>
                        </div>

                        {/* Desktop back */}
                        <div className="mb-8 hidden lg:block">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to home
                            </Link>
                        </div>

                        {/* Auth Card */}
                        <div className="rounded-3xl border border-gray-200/80 bg-white/90 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-9 dark:border-white/[0.08] dark:bg-[#17171c]/90 dark:shadow-black/30">

                            {/* Heading */}
                            <div className="mb-8">
                                <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                                    <Sparkles className="h-4 w-4" />
                                </div>

                                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                    {title}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                            </div>

                            {/* Existing form */}
                            {children}

                            {/* Footer */}
                            <div className="mt-7 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {footerText}{" "}
                                    <Link
                                        to={footerLink}
                                        className="font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                                    >
                                        {footerLinkText}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-[10px] text-gray-400 dark:text-gray-600">
                            By continuing, you agree to our terms and privacy
                            policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;