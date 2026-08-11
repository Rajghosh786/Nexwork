import { useEffect, useState } from "react";
import { Plus, Search, Archive, X } from "lucide-react";
import api from "../../services/api";
import TodoList from "./TodoList";

const TodoBoard = () => {
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [showArchived, setShowArchived] = useState(false); 
    // Drag and drop state
    const [draggedCard, setDraggedCard] = useState(null);
    const [draggedOverList, setDraggedOverList] = useState(null);

    const fetchBoard = async () => {
        try {
            setLoading(true);
            const response = await api.get("/todo/personal");
            setBoard(response.data.board);
            setError(null);
        } catch (err) {
            setError("Failed to load todo board");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoard();
    }, []);

    const handleAddList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;

        try {
            const response = await api.post("/todo/personal/lists", {
                title: newListTitle,
            });
            setBoard((prev) => ({
                ...prev,
                lists: [...prev.lists, response.data.list],
            }));
            setNewListTitle("");
            setIsAddingList(false);
        } catch (err) {
            console.error("Failed to create list:", err);
        }
    };

    const handleUpdateList = (listId, updatedList) => {
        setBoard((prev) => ({
            ...prev,
            lists: prev.lists.map((l) => (l._id === listId ? updatedList : l)),
        }));
    };

    const handleDeleteList = (listId) => {
        setBoard((prev) => ({
            ...prev,
            lists: prev.lists.filter((l) => l._id !== listId),
        }));
    };

    const handleUnarchive = async (listId, cardId) => {
        try {
            await api.patch(`/todo/personal/lists/${listId}/cards/${cardId}`, {
                archived: false,
            });

            await fetchBoard();
        } catch (err) {
            console.error("Failed to unarchive card:", err);
        }
    };

    // --- Drag and Drop Handlers ---
    
    const onDragStartCard = (e, card, sourceListId) => {
        setDraggedCard({ card, sourceListId });
        // Set drag effect
        e.dataTransfer.effectAllowed = "move";
        // Slightly delay hiding the dragged element so preview still shows
        setTimeout(() => {
            e.target.style.opacity = "0.5";
        }, 0);
    };

    const onDragEndCard = (e) => {
        e.target.style.opacity = "1";
        setDraggedCard(null);
        setDraggedOverList(null);
    };

    const onDragOverList = (e, listId) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
        if (draggedOverList !== listId) {
            setDraggedOverList(listId);
        }
    };

    const onDropCard = async (e, targetListId) => {
        e.preventDefault();
        if (!draggedCard) return;

        const { card, sourceListId } = draggedCard;
        
        // Optimistic update logic could go here, but for simplicity and correctness,
        // we'll let the backend determine the exact new position if dropped generically on the list.
        // If we wanted sorting within the list, we'd need to calculate targetPosition based on mouse coordinates.
        // For now, dropping on a list appends it to the end.
        
        const targetList = board.lists.find(l => l._id === targetListId);
        const targetPosition = targetList.cards.length;

        try {
            // Optimistic UI update
            setBoard(prev => {
                const newLists = JSON.parse(JSON.stringify(prev.lists));
                const sourceList = newLists.find(l => l._id === sourceListId);
                const targetListRef = newLists.find(l => l._id === targetListId);
                
                const cardIndex = sourceList.cards.findIndex(c => c._id === card._id);
                const [movedCard] = sourceList.cards.splice(cardIndex, 1);
                
                targetListRef.cards.push(movedCard);
                return { ...prev, lists: newLists };
            });

            const response = await api.put("/todo/personal/cards/move", {
                sourceListId,
                cardId: card._id,
                targetListId,
                targetPosition
            });
            
            // Sync with backend truth
            setBoard(response.data.board);
        } catch (err) {
            console.error("Failed to move card:", err);
            fetchBoard(); // Revert on failure
        }
    };


    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-sm text-gray-400">Loading board...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-sm text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-gray-50 dark:bg-[#151519]">
            {/* Board Header */}
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-[#1c1c21]">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My To-Do
                </h1>
                <div className="flex w-full max-w-md items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search cards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-[#151519] dark:text-white"
                        />
                    </div>

                    <button
                        onClick={() => setShowArchived(true)}
                        className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-[#151519] dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <Archive className="h-4 w-4" />
                        Archived
                    </button>
                </div>
            </div>

            {/* Board Content (Lists horizontal scroll) */}
                <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <div className="flex flex-wrap content-start items-start gap-4">
                    {board?.lists
                        ?.filter((list) => {
                            if (!searchQuery.trim()) return true;

                            const query = searchQuery.trim().toLowerCase();

                            return list.cards.some((card) => {
                                return (
                                    card.title?.toLowerCase().includes(query) ||
                                    card.description?.toLowerCase().includes(query) ||
                                    card.labels?.some((label) =>
                                        label.toLowerCase().includes(query)
                                    )
                                );
                            });
                        })
                        .map((list) => (
                            <TodoList
                                key={list._id}
                                list={list}
                                searchQuery={searchQuery}
                            onUpdateList={(updated) => handleUpdateList(list._id, updated)}
                            onDeleteList={() => handleDeleteList(list._id)}
                            onBoardUpdate={fetchBoard}
                            
                            // Drag and drop props
                            onDragStartCard={onDragStartCard}
                            onDragEndCard={onDragEndCard}
                            onDragOverList={onDragOverList}
                            onDropCard={onDropCard}
                            isDraggedOver={draggedOverList === list._id}
                        />
                    ))}

                    {/* Add List Button */}
                    <div className="w-full sm:w-[280px]">
                        {isAddingList ? (
                            <form
                                onSubmit={handleAddList}
                                className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1c1c21]"
                            >
                                <input
                                    type="text"
                                    value={newListTitle}
                                    onChange={(e) => setNewListTitle(e.target.value)}
                                    placeholder="Enter list title..."
                                    className="mb-2 w-full rounded border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-violet-500 dark:border-gray-700"
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        className="rounded bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                                    >
                                        Add list
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingList(false)}
                                        className="rounded px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAddingList(true)}
                                className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white/50 px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1c1c21]/50 dark:hover:bg-[#1c1c21]"
                            >
                                <Plus className="h-4 w-4" />
                                Add list
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showArchived && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div
            className="absolute inset-0"
            onClick={() => setShowArchived(false)}
        />

        <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-[#1c1c21]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Archived Cards
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Archived cards are hidden from your board.
                    </p>
                </div>

                <button
                    onClick={() => setShowArchived(false)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Archived Cards */}
            <div className="flex-1 overflow-y-auto p-5">
                {(() => {
                    const archivedCards =
                        board?.lists?.flatMap((list) =>
                            list.cards
                                .filter((card) => card.archived)
                                .map((card) => ({
                                    ...card,
                                    listId: list._id,
                                    listTitle: list.title,
                                }))
                        ) || [];

                    if (archivedCards.length === 0) {
                        return (
                            <div className="flex min-h-40 items-center justify-center text-sm text-gray-500">
                                No archived cards
                            </div>
                        );
                    }

                return (
                    <div className="space-y-3">
                        {archivedCards.map((card) => (
                            <div
                                key={card._id}
                                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#151519]"
                            >
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {card.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        From list: {card.listTitle}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        handleUnarchive(
                                            card.listId,
                                            card._id
                                        )
                                    }
                                    className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-700"
                                >
                                    <Archive className="h-3.5 w-3.5" />
                                    Unarchive
                                </button>
                            </div>
                        ))}
                    </div>
                            );
                        })()}
                        </div>
                    </div>
                </div>
                )}
        </div>
    );
};

export default TodoBoard;
