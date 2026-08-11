    import { useState } from "react";
    import { MoreHorizontal, Plus } from "lucide-react";
    import api from "../../services/api";
    import TodoCard from "./TodoCard";

    const TodoList = ({
        list,
        searchQuery,
        onUpdateList,
        onDeleteList,
        onBoardUpdate,
        onDragStartCard,
        onDragEndCard,
        onDragOverList,
        onDropCard,
        isDraggedOver
    }) => {
        const [isEditingTitle, setIsEditingTitle] = useState(false);
        const [editTitle, setEditTitle] = useState(list.title);
        const [isAddingCard, setIsAddingCard] = useState(false);
        const [newCardTitle, setNewCardTitle] = useState("");
        const [showOptions, setShowOptions] = useState(false);

        const query = searchQuery.trim().toLowerCase();

        const filteredCards = list.cards.filter((card) => {
            if (!query) return true;

            return (
                card.title?.toLowerCase().includes(query) ||
                card.description?.toLowerCase().includes(query) ||
                card.labels?.some((label) =>
                    label.toLowerCase().includes(query)
                )
            );
        });

        const handleTitleSubmit = async (e) => {
            e.preventDefault();
            if (!editTitle.trim() || editTitle === list.title) {
                setIsEditingTitle(false);
                setEditTitle(list.title);
                return;
            }

            try {
                const response = await api.patch(`/todo/personal/lists/${list._id}`, {
                    title: editTitle,
                });
                onUpdateList(response.data.list);
                setIsEditingTitle(false);
            } catch (err) {
                console.error("Failed to update list title:", err);
            }
        };

        const handleDeleteList = async () => {
            if (!window.confirm("Are you sure you want to delete this list and all its cards?")) return;
            try {
                await api.delete(`/todo/personal/lists/${list._id}`);
                onDeleteList();
            } catch (err) {
                console.error("Failed to delete list:", err);
            }
        };

        const handleAddCard = async (e) => {
            e.preventDefault();
            if (!newCardTitle.trim()) return;

            try {
                const response = await api.post(`/todo/personal/lists/${list._id}/cards`, {
                    title: newCardTitle,
                });
                onUpdateList({
                    ...list,
                    cards: [...list.cards, response.data.card]
                });
                setNewCardTitle("");
                setIsAddingCard(false);
            } catch (err) {
                console.error("Failed to create card:", err);
            }
        };

        return (
            <div 
                className={`flex max-h-full w-[280px] shrink-0 flex-col rounded-xl border ${isDraggedOver ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/10' : 'border-gray-200 bg-gray-100/50 dark:border-gray-800 dark:bg-[#1c1c21]/80'}`}
                onDragOver={(e) => onDragOverList(e, list._id)}
                onDrop={(e) => onDropCard(e, list._id)}
            >
                {/* List Header */}
                <div className="group flex items-center justify-between p-3">
                    {isEditingTitle ? (
                        <form onSubmit={handleTitleSubmit} className="flex-1">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={handleTitleSubmit}
                                className="w-full rounded border border-violet-500 bg-white px-2 py-1 text-sm font-semibold outline-none dark:bg-[#151519] dark:text-white"
                                autoFocus
                            />
                        </form>
                    ) : (
                        <h3 
                            onClick={() => setIsEditingTitle(true)}
                            className="flex-1 cursor-text truncate px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-100"
                        >
                            {list.title}
                            <span className="ml-2 text-xs font-normal text-blue-500">{list.cards.length}</span>
                        </h3>
                    )}

                    <div className="relative ml-2 shrink-0">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="grid h-6 w-6 place-items-center rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {showOptions && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setShowOptions(false)}
                                />
                                <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-[#1c1c21]">
                                    <button
                                        onClick={() => {
                                            setShowOptions(false);
                                            handleDeleteList();
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Delete List
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
                    <div className="flex flex-col gap-2">
                        {filteredCards.map((card) => (
                            <TodoCard
                                key={card._id}
                                card={card}
                                listId={list._id}
                                onBoardUpdate={onBoardUpdate}
                                onDragStart={(e) => onDragStartCard(e, card, list._id)}
                                onDragEnd={onDragEndCard}
                            />
                        ))}
                        
                        {/* Placeholder for empty list during drag over */}
                        {filteredCards.length === 0 && isDraggedOver && (
                            <div className="h-20 rounded-lg border-2 border-dashed border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-900/20" />
                        )}
                    </div>
                </div>

                {/* Add Card Footer */}
                <div className="p-2">
                    {isAddingCard ? (
                        <form
                            onSubmit={handleAddCard}
                            className="rounded-lg bg-white p-2 shadow-sm dark:bg-[#151519]"
                        >
                            <textarea
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                placeholder="Enter card title..."
                                className="mb-2 w-full resize-none rounded bg-transparent text-sm outline-none"
                                rows={3}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddCard(e);
                                    }
                                }}
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="rounded bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                                >
                                    Add card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCard(false)}
                                    className="rounded px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAddingCard(true)}
                            className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-gray-500 transition hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                            <Plus className="h-4 w-4" />
                            Add a card
                        </button>
                    )}
                </div>
            </div>
        );
    };

    export default TodoList;
