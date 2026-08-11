const AuthButton = ({
    children,
    type = "submit",
    loading = false,
    disabled = false,
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Please wait..." : children}
        </button>
    );
};

export default AuthButton;