import {
    ArrowRight,
    Bell,
    Check,
    CheckCircle2,
    ChevronRight,
    Hash,
    Layers3,
    Menu,
    MessageSquare,
    Moon,
    MoreHorizontal,
    Play,
    Search,
    Sparkles,
    Sun,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const goTo = (path) => {
        window.location.href = path;
    };

    return (
        <div className="min-h-screen overflow-hidden bg-white text-gray-900 dark:bg-[#0f0f12] dark:text-white">
            {/* Navbar */}
            <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-[#0f0f12]/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center gap-2"
                    >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 shadow-sm shadow-violet-600/20">
                            <Layers3 className="h-4 w-4 text-white" />
                        </div>

                        <span className="text-base font-bold tracking-tight">
                            Nexwork
                        </span>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#features"
                            className="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Features
                        </a>

                        <a
                            href="#workflow"
                            className="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Workflow
                        </a>

                        <a
                            href="#collaboration"
                            className="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Collaboration
                        </a>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-2 md:flex">
                        <button
                            onClick={toggleTheme}
                            className="grid h-9 w-9 place-items-center rounded-lg
                                    text-gray-600 transition hover:bg-gray-100
                                    dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={() => goTo("/login")}
                            className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            Sign in
                        </button>

                        <button
                            onClick={() => goTo("/register")}
                            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700"
                        >
                            Get started
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden dark:border-gray-800 dark:bg-[#0f0f12]">
                        <div className="flex flex-col gap-1">
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Features
                            </a>

                            <a
                                href="#workflow"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Workflow
                            </a>

                            <a
                                href="#collaboration"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Collaboration
                            </a>

                            <div className="mt-2 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                                <button
                                    onClick={() => goTo("/login")}
                                    className="flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Sign in
                                </button>

                                <button
                                    onClick={() => goTo("/register")}
                                    className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white"
                                >
                                    Get started
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* Hero */}
                <section className="relative px-5 pb-20 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-44">
                    {/* Background decoration */}
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-600/10" />

                        <div className="absolute left-[10%] top-[35%] h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

                        <div className="absolute right-[10%] top-[30%] h-40 w-40 rounded-full bg-purple-500/5 blur-3xl" />
                    </div>

                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            {/* Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Everything your team needs
                                <ChevronRight className="h-3 w-3" />
                            </div>

                            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-7xl dark:text-white">
                                Work together.
                                <br />
                                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Move forward.
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base dark:text-gray-400">
                                Bring conversations, projects, tasks, and your
                                entire team together in one beautifully
                                organized workspace.
                            </p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <button
                                    onClick={() => goTo("/register")}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
                                >
                                    Get started for free
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </button>

                                <button
                                    onClick={() =>
                                        document
                                            .getElementById("workflow")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                            })
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-800 dark:bg-[#17171b] dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    See how it works
                                </button>
                            </div>

                            <p className="mt-4 text-[10px] text-gray-400">
                                Simple to start · Built for teams · No
                                complicated setup
                            </p>
                        </div>

                        {/* Hero App Preview */}
                        <div className="relative mx-auto mt-16 max-w-6xl lg:mt-20">
                            <div className="absolute -inset-4 -z-10 rounded-[32px] bg-violet-500/10 blur-2xl" />

                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-300/40 dark:border-gray-700 dark:bg-[#151519] dark:shadow-black/40">
                                {/* Browser bar */}
                                <div className="flex h-10 items-center border-b border-gray-100 px-4 dark:border-gray-800">
                                    <div className="flex gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    </div>

                                    <div className="mx-auto hidden h-6 w-72 rounded-md bg-gray-50 sm:block dark:bg-[#1c1c21]" />
                                </div>

                                {/* Fake application */}
                                <div className="flex min-h-[390px]">
                                    {/* Sidebar */}
                                    <div className="hidden w-52 shrink-0 border-r border-gray-100 bg-gray-50/70 p-3 sm:block dark:border-gray-800 dark:bg-[#121216]">
                                        <div className="mb-5 flex items-center gap-2 px-2">
                                            <div className="grid h-6 w-6 place-items-center rounded-md bg-violet-600">
                                                <Layers3 className="h-3 w-3 text-white" />
                                            </div>

                                            <span className="text-xs font-bold">
                                                Workspace
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <PreviewNav active>
                                                <Hash className="h-3.5 w-3.5" />
                                                General
                                            </PreviewNav>

                                            <PreviewNav>
                                                <Hash className="h-3.5 w-3.5" />
                                                Development
                                            </PreviewNav>

                                            <PreviewNav>
                                                <Hash className="h-3.5 w-3.5" />
                                                Design
                                            </PreviewNav>
                                        </div>

                                        <p className="mb-2 mt-6 px-2 text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                            Direct Messages
                                        </p>

                                        <PreviewNav>
                                            <div className="h-5 w-5 rounded-full bg-violet-200 dark:bg-violet-900" />
                                            Alex
                                        </PreviewNav>

                                        <PreviewNav>
                                            <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                                            Sarah
                                        </PreviewNav>

                                        <div className="mt-8 rounded-lg bg-violet-600/10 p-3 dark:bg-violet-500/10">
                                            <p className="text-[9px] font-semibold text-violet-700 dark:text-violet-300">
                                                Stay organized
                                            </p>

                                            <p className="mt-1 text-[8px] leading-4 text-gray-500 dark:text-gray-400">
                                                Keep conversations and
                                                projects together.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Main */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex h-12 items-center justify-between border-b border-gray-100 px-4 dark:border-gray-800">
                                            <div>
                                                <p className="text-[8px] text-gray-400">
                                                    Channel
                                                </p>
                                                <p className="text-xs font-semibold">
                                                    # development
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <div className="grid h-7 w-7 place-items-center rounded-md text-gray-400">
                                                    <Search className="h-3.5 w-3.5" />
                                                </div>

                                                <div className="grid h-7 w-7 place-items-center rounded-md text-gray-400">
                                                    <Bell className="h-3.5 w-3.5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid h-[338px] grid-cols-1 gap-3 p-4 lg:grid-cols-[1fr_240px]">
                                            {/* Messages */}
                                            <div className="flex flex-col justify-end">
                                                <div className="space-y-5">
                                                    <PreviewMessage
                                                        initials="AK"
                                                        name="Alex Kumar"
                                                        time="10:42 AM"
                                                        text="The new project structure is ready. I've added the issues we discussed."
                                                    />

                                                    <PreviewMessage
                                                        initials="SM"
                                                        name="Sarah Miller"
                                                        time="10:45 AM"
                                                        text="Perfect. I'll start working on the authentication flow."
                                                        violet
                                                    />

                                                    <PreviewMessage
                                                        initials="RK"
                                                        name="Raj"
                                                        time="10:48 AM"
                                                        text="Sounds good. Let's review everything before the next release."
                                                    />
                                                </div>

                                                <div className="mt-6 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                                                    <span className="flex-1 text-[9px] text-gray-400">
                                                        Message #development...
                                                    </span>
                                                    <MessageSquare className="h-3 w-3 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* Project card */}
                                            <div className="hidden rounded-xl border border-gray-200 bg-gray-50/60 p-3 lg:block dark:border-gray-800 dark:bg-[#1a1a1f]">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-[10px] font-bold">
                                                        Current project
                                                    </p>
                                                    <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
                                                </div>

                                                <p className="text-xs font-semibold">
                                                    Website Redesign
                                                </p>

                                                <p className="mt-1 text-[8px] leading-4 text-gray-400">
                                                    Improve the public product
                                                    experience.
                                                </p>

                                                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                                    <div className="h-full w-[68%] rounded-full bg-violet-600" />
                                                </div>

                                                <div className="mt-2 flex justify-between text-[8px] text-gray-400">
                                                    <span>68% complete</span>
                                                    <span>12 issues</span>
                                                </div>

                                                <div className="mt-5 space-y-2">
                                                    <PreviewIssue
                                                        title="Update landing page"
                                                        status="Done"
                                                    />

                                                    <PreviewIssue
                                                        title="Improve mobile layout"
                                                        status="Review"
                                                    />

                                                    <PreviewIssue
                                                        title="Add workspace flow"
                                                        status="In Progress"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logo/value strip */}
                <section className="border-y border-gray-100 bg-gray-50/70 py-8 dark:border-gray-800 dark:bg-[#121216]">
                    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
                        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Everything in one place
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                            <ValueItem
                                icon={<MessageSquare />}
                                title="Conversations"
                            />
                            <ValueItem
                                icon={<Layers3 />}
                                title="Projects"
                            />
                            <ValueItem
                                icon={<CheckCircle2 />}
                                title="Tasks & Issues"
                            />
                            <ValueItem
                                icon={<Users />}
                                title="Team"
                            />
                            <ValueItem
                                icon={<Bell />}
                                title="Notifications"
                            />
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section
                    id="features"
                    className="px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl">
                        <SectionHeading
                            eyebrow="ONE WORKSPACE"
                            title="Everything your team needs."
                            description="Stop jumping between different tools. Keep your conversations, projects, tasks, and people connected in one place."
                        />

                        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                large
                                icon={<MessageSquare />}
                                title="Conversations that stay organized"
                                description="Create focused channels for your teams and projects, or start direct conversations when you need to talk privately."
                            >
                                <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-[#151519]">
                                    <div className="space-y-3">
                                        <MiniConversation
                                            icon="#"
                                            title="development"
                                            text="The API is ready for review."
                                        />

                                        <MiniConversation
                                            icon="#"
                                            title="design"
                                            text="Updated the dashboard screens."
                                        />

                                        <MiniConversation
                                            icon="@"
                                            title="Sarah Miller"
                                            text="Can you check this when you get a chance?"
                                        />
                                    </div>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                icon={<Layers3 />}
                                title="Projects without the clutter"
                                description="Organize work into projects and keep every issue, conversation, and milestone easy to find."
                            >
                                <div className="mt-7 grid grid-cols-3 gap-2">
                                    <MiniStatus
                                        title="To Do"
                                        count="4"
                                    />
                                    <MiniStatus
                                        title="Review"
                                        count="3"
                                    />
                                    <MiniStatus
                                        title="Done"
                                        count="8"
                                    />
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                icon={<Users />}
                                title="Built around your team"
                                description="Bring the right people into the right workspace, channels, and projects."
                            >
                                <div className="mt-7 flex items-center">
                                    {["AK", "SM", "RK", "JD", "MP"].map(
                                        (initials, index) => (
                                            <div
                                                key={initials}
                                                className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-gray-100 text-[9px] font-bold text-gray-600 dark:border-[#151519] dark:bg-gray-800 dark:text-gray-300 ${
                                                    index !== 0 ? "-ml-2" : ""
                                                }`}
                                            >
                                                {initials}
                                            </div>
                                        )
                                    )}

                                    <div className="ml-3 text-[10px] font-medium text-gray-400">
                                        + 13 members
                                    </div>
                                </div>
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Workflow */}
                <section
                    id="workflow"
                    className="border-y border-gray-100 bg-gray-50/60 px-5 py-24 sm:px-6 lg:px-8 lg:py-32 dark:border-gray-800 dark:bg-[#121216]"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                            <div>
                                <SectionLabel>
                                    FROM IDEA TO DONE
                                </SectionLabel>

                                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                    Turn conversations into progress.
                                </h2>

                                <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-400">
                                    Your team shouldn't have to remember where
                                    something was discussed. Connect the
                                    conversation to the work and keep
                                    everything moving.
                                </p>

                                <div className="mt-8 space-y-5">
                                    <Step
                                        number="01"
                                        title="Create a project"
                                        text="Give your team a clear place to organize the work."
                                    />

                                    <Step
                                        number="02"
                                        title="Break work into issues"
                                        text="Turn ideas and requirements into actionable pieces."
                                    />

                                    <Step
                                        number="03"
                                        title="Move work forward"
                                        text="Track progress from To Do through Review to Done."
                                    />
                                </div>
                            </div>

                            {/* Kanban preview */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-200/50 dark:border-gray-700 dark:bg-[#17171b] dark:shadow-black/20">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] text-gray-400">
                                            Project
                                        </p>
                                        <p className="text-sm font-bold">
                                            Product Launch
                                        </p>
                                    </div>

                                    <button className="rounded-md border border-gray-200 p-1.5 dark:border-gray-700">
                                        <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    <KanbanColumn
                                        title="To Do"
                                        items={[
                                            "Landing page",
                                            "Invite flow",
                                        ]}
                                    />

                                    <KanbanColumn
                                        title="In Progress"
                                        items={[
                                            "Authentication",
                                            "Dashboard",
                                        ]}
                                    />

                                    <KanbanColumn
                                        title="Review"
                                        items={[
                                            "API integration",
                                            "Mobile UI",
                                        ]}
                                    />

                                    <KanbanColumn
                                        title="Done"
                                        items={[
                                            "Database",
                                            "Workspace",
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Collaboration */}
                <section
                    id="collaboration"
                    className="px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="relative overflow-hidden rounded-3xl bg-[#151519] p-8 text-white sm:p-10">
                                <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

                                <div className="relative">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600">
                                        <Bell className="h-5 w-5" />
                                    </div>

                                    <h3 className="mt-8 max-w-md text-2xl font-bold tracking-tight">
                                        Never lose track of what matters.
                                    </h3>

                                    <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
                                        Keep your team updated with unread
                                        messages, mentions, invitations, and
                                        notifications right where you need
                                        them.
                                    </p>

                                    <div className="mt-8 space-y-2">
                                        <DarkNotification
                                            title="You were mentioned"
                                            text="Sarah mentioned you in #development"
                                        />

                                        <DarkNotification
                                            title="New invitation"
                                            text="You have been invited to a workspace"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 sm:p-10 dark:border-gray-800 dark:bg-[#151519]">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm dark:bg-[#1f1f24]">
                                    <CheckCircle2 className="h-5 w-5 text-violet-600" />
                                </div>

                                <h3 className="mt-8 max-w-md text-2xl font-bold tracking-tight">
                                    Less context switching. More getting done.
                                </h3>

                                <p className="mt-4 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    Give your team one place to communicate,
                                    plan, execute, and see what's happening
                                    next.
                                </p>

                                <div className="mt-8 space-y-3">
                                    <CheckItem>
                                        Focused team communication
                                    </CheckItem>

                                    <CheckItem>
                                        Projects and issue tracking
                                    </CheckItem>

                                    <CheckItem>
                                        Workspace-based collaboration
                                    </CheckItem>

                                    <CheckItem>
                                        Direct messages and notifications
                                    </CheckItem>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
                    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-violet-600 px-6 py-16 text-center sm:px-10 lg:py-20">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute left-1/2 top-[-180px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
                        </div>

                        <div className="relative">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                                Ready when you are
                            </p>

                            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Bring your team and your work together.
                            </h2>

                            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-violet-100">
                                Create your workspace and start building a
                                better way to work together.
                            </p>

                            <button
                                onClick={() => goTo("/register")}
                                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-50"
                            >
                                Get started for free
                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
        <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111114]">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 shadow-sm shadow-violet-600/20">
                            <Layers3 className="h-4 w-4 text-white" />
                        </div>

                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                Nexwork<span className="text-violet-600">.</span>
                            </span>
                        </div>

                        <p className="mt-5 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                            A simple workspace for teams to communicate, manage
                            projects, track tasks, and get work done together.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-violet-900 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
                                aria-label="GitHub"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
                                </svg>
                            </a>

                            <a
                                href="#"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-violet-900 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
                                aria-label="LinkedIn"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2 2 0 1 0 5.25 7 2 2 0 0 0 5.25 3ZM20.44 13.41c0-3.46-1.84-5.07-4.3-5.07-1.98 0-2.87 1.09-3.36 1.86V8.5H9.4V20h3.38v-5.7c0-1.5.28-2.96 2.15-2.96 1.84 0 1.86 1.72 1.86 3.06V20h3.38l.27-6.59Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                            Product
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <a
                                    href="#features"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Changelog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Roadmap
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                            Company
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
                                >
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-14 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Nexwork. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5 text-xs text-gray-400">
                        <a
                            href="#"
                            className="transition hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="#"
                            className="transition hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
        </div>
    );
};

/* Components */

const PreviewNav = ({ children, active = false }) => (
    <div
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[9px] font-medium ${
            active
                ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                : "text-gray-500 dark:text-gray-400"
        }`}
    >
        {children}
    </div>
);

const PreviewMessage = ({
    initials,
    name,
    time,
    text,
    violet = false,
}) => (
    <div className="flex gap-2.5">
        <div
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[8px] font-bold ${
                violet
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
        >
            {initials}
        </div>

        <div className="min-w-0">
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold">{name}</span>
                <span className="text-[7px] text-gray-400">{time}</span>
            </div>

            <p className="mt-1 text-[9px] leading-4 text-gray-500 dark:text-gray-400">
                {text}
            </p>
        </div>
    </div>
);

const PreviewIssue = ({ title, status }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-[#202026]">
        <p className="truncate text-[8px] font-medium">{title}</p>

        <p className="mt-1 text-[7px] text-gray-400">{status}</p>
    </div>
);

const ValueItem = ({ icon, title }) => (
    <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <div className="text-violet-600 dark:text-violet-400">
            {icon && <div className="h-4 w-4">{icon}</div>}
        </div>

        <span className="text-[10px] font-semibold">{title}</span>
    </div>
);

const SectionHeading = ({ eyebrow, title, description }) => (
    <div className="max-w-2xl">
        <SectionLabel>{eyebrow}</SectionLabel>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
            {description}
        </p>
    </div>
);

const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
        {children}
    </p>
);

const FeatureCard = ({
    icon,
    title,
    description,
    children,
    large = false,
}) => (
    <div
        className={`rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/40 dark:border-gray-800 dark:bg-[#151519] dark:hover:shadow-black/20 ${
            large ? "lg:col-span-2" : ""
        }`}
    >
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <div className="h-4 w-4">{icon}</div>
        </div>

        <h3 className="mt-5 text-base font-bold">{title}</h3>

        <p className="mt-2 max-w-xl text-xs leading-6 text-gray-500 dark:text-gray-400">
            {description}
        </p>

        {children}
    </div>
);

const MiniConversation = ({ icon, title, text }) => (
    <div className="flex items-center gap-3 rounded-lg bg-white p-2.5 dark:bg-[#1c1c21]">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-violet-100 text-[10px] font-bold text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            {icon}
        </div>

        <div className="min-w-0">
            <p className="text-[9px] font-semibold">{title}</p>
            <p className="truncate text-[8px] text-gray-400">{text}</p>
        </div>
    </div>
);

const MiniStatus = ({ title, count }) => (
    <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-[#1c1c21]">
        <p className="text-[8px] font-medium text-gray-400">{title}</p>
        <p className="mt-1 text-lg font-bold">{count}</p>
    </div>
);

const Step = ({ number, title, text }) => (
    <div className="flex gap-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-[9px] font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
            {number}
        </div>

        <div>
            <h3 className="text-sm font-bold">{title}</h3>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {text}
            </p>
        </div>
    </div>
);

const KanbanColumn = ({ title, items }) => (
    <div className="min-w-0 rounded-xl bg-gray-50 p-2 dark:bg-[#121216]">
        <div className="mb-2 flex items-center justify-between">
            <span className="truncate text-[8px] font-bold">{title}</span>
            <span className="text-[7px] text-gray-400">{items.length}</span>
        </div>

        <div className="space-y-1.5">
            {items.map((item) => (
                <div
                    key={item}
                    className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-[#1c1c21]"
                >
                    <p className="truncate text-[7px] font-medium">
                        {item}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const DarkNotification = ({ title, text }) => (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-600/20">
            <Bell className="h-3.5 w-3.5 text-violet-300" />
        </div>

        <div className="min-w-0">
            <p className="text-[9px] font-semibold">{title}</p>

            <p className="mt-0.5 truncate text-[8px] text-gray-500">
                {text}
            </p>
        </div>
    </div>
);

const CheckItem = ({ children }) => (
    <div className="flex items-center gap-3">
        <div className="grid h-5 w-5 place-items-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Check className="h-3 w-3" />
        </div>

        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {children}
        </span>
    </div>
);

export default LandingPage;