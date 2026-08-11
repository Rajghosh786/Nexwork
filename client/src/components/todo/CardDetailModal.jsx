import { useState, useEffect } from "react";
import { X, Calendar, AlignLeft, CheckSquare, Tag, Trash2, Archive, Loader2 } from "lucide-react";
import api from "../../services/api";

const PRIORITIES = ["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"];

const CardDetailModal = ({ card, listId, onClose, onBoardUpdate }) => {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || "");
    const [priority, setPriority] = useState(card.priority || "NONE");
    const [dueDate, setDueDate] = useState(
        card.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : ""
    );
    const [labels, setLabels] = useState(card.labels || []);
    const [checklist, setChecklist] = useState(card.checklist || []);
    
    // UI state
    const [newLabel, setNewLabel] = useState("");
    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            
            await api.patch(`/todo/personal/lists/${listId}/cards/${card._id}`, {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                labels,
                checklist,
            });
            
            onBoardUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save card");
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        
        try {
            setIsSaving(true);
            await api.delete(`/todo/personal/lists/${listId}/cards/${card._id}`);
            onBoardUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete card");
            setIsSaving(false);
        }
    };

    const handleArchive = async () => {
        try {
            setIsSaving(true);
            await api.patch(`/todo/personal/lists/${listId}/cards/${card._id}`, {
                archived: true,
            });
            onBoardUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to archive card");
            setIsSaving(false);
        }
    };

    // Checklist handlers
    const addChecklistItem = (e) => {
        e.preventDefault();
        if (!newChecklistItem.trim()) return;
        
        setChecklist([...checklist, { text: newChecklistItem.trim(), completed: false }]);
        setNewChecklistItem("");
    };

    const toggleChecklistItem = (index) => {
        const updated = [...checklist];
        updated[index].completed = !updated[index].completed;
        setChecklist(updated);
    };

    const removeChecklistItem = (index) => {
        setChecklist(checklist.filter((_, i) => i !== index));
    };

    // Label handlers
    const addLabel = (e) => {
        e.preventDefault();
        if (!newLabel.trim() || labels.includes(newLabel.trim())) return;
        
        setLabels([...labels, newLabel.trim()]);
        setNewLabel("");
    };

    const removeLabel = (labelToRemove) => {
        setLabels(labels.filter(label => label !== labelToRemove));
    };

    const completedCount = checklist.filter(item => item.completed).length;
    const progressPercent = checklist.length === 0 ? 0 : Math.round((completedCount / checklist.length) * 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6">
            <div 
                className="absolute inset-0" 
                onClick={!isSaving ? onClose : undefined}
            />
            
            <div className="relative flex max-h-full w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-[#1c1c21]">
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-6 dark:border-gray-800">
                    <div className="flex-1 pr-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-xl font-semibold text-gray-900 outline-none focus:border-b-2 focus:border-violet-500 dark:text-white"
                            placeholder="Card title"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Main Column */}
                        <div className="flex-1 space-y-6">
                            
                            {/* Description */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <AlignLeft className="h-4 w-4" />
                                    <h3 className="font-semibold">Description</h3>
                                </div>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a more detailed description..."
                                    className="min-h-[120px] w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-[#151519] dark:text-white dark:focus:bg-[#151519]"
                                />
                            </div>

                            {/* Checklist */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <CheckSquare className="h-4 w-4" />
                                        <h3 className="font-semibold">Checklist</h3>
                                    </div>
                                    {checklist.length > 0 && (
                                        <span className="text-xs text-gray-500">
                                            {completedCount} / {checklist.length} completed
                                        </span>
                                    )}
                                </div>

                                {checklist.length > 0 && (
                                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div 
                                            className="h-full bg-violet-500 transition-all duration-300" 
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {checklist.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 group">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => toggleChecklistItem(index)}
                                                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-violet-600 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700"
                                            />
                                            <span className={`flex-1 text-sm ${item.completed ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-200"}`}>
                                                {item.text}
                                            </span>
                                            <button
                                                onClick={() => removeChecklistItem(index)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={addChecklistItem} className="mt-2">
                                    <input
                                        type="text"
                                        value={newChecklistItem}
                                        onChange={(e) => setNewChecklistItem(e.target.value)}
                                        placeholder="Add an item..."
                                        className="w-full rounded border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-gray-700"
                                    />
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="w-full space-y-6 md:w-48 shrink-0">
                            
                            {/* Priority */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Priority
                                </h4>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-500 dark:border-gray-700 dark:bg-[#151519] dark:text-gray-200"
                                >
                                    {PRIORITIES.map((p) => (
                                        <option key={p} value={p}>
                                            {p.charAt(0) + p.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Due Date
                                </h4>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-violet-500 dark:border-gray-700 dark:bg-[#151519] dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Labels
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {labels.map((label, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                        >
                                            {label}
                                            <button
                                                onClick={() => removeLabel(label)}
                                                className="hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={addLabel} className="relative mt-2">
                                    <Tag className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        placeholder="Add label..."
                                        className="w-full rounded border border-gray-200 bg-transparent py-1.5 pl-7 pr-2 text-xs outline-none focus:border-violet-500 dark:border-gray-700"
                                    />
                                </form>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Actions
                                </h4>
                                <button
                                    onClick={handleArchive}
                                    className="flex w-full items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <Archive className="h-4 w-4" />
                                    Archive
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex w-full items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-gray-100 p-4 dark:border-gray-800 bg-gray-50 dark:bg-[#151519] rounded-b-2xl">
                    <div className="text-sm text-red-500">
                        {error}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-[#1c1c21]"
                        >
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetailModal;
