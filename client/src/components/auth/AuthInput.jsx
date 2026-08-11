const AuthInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    error
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-300 focus:border-slate-900"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
            />

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;