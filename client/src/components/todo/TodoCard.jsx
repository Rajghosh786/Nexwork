import { useState } from "react";
import { CheckSquare, Clock, AlignLeft } from "lucide-react";
import CardDetailModal from "./CardDetailModal";

const PRIORITY_COLORS = {
    NONE: "",
    LOW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const TodoCard = ({ card, listId, onBoardUpdate, onDragStart, onDragEnd }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const completedChecklistItems = card.checklist?.filter((item) => item.completed).length || 0;
    const totalChecklistItems = card.checklist?.length || 0;
    const hasChecklist = totalChecklistItems > 0;

    const formattedDate = card.dueDate
        ? new Date(card.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
          })
        : null;

    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && !card.archived;

    if (card.archived) {
        return null; // Don't show archived cards on the board by default
    }

    return (
        <>
            <div
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={() => setIsModalOpen(true)}
                className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-[#151519]"
            >
                {/* Labels */}
                {card.labels?.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                        {card.labels.map((label, index) => (
                            <span
                                key={index}
                                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                    {card.title}
                </h4>

                {/* Metadata Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Priority */}
                    {card.priority && card.priority !== "NONE" && (
                        <div
                            className={`flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_COLORS[card.priority]}`}
                        >
                            {card.priority.charAt(0) + card.priority.slice(1).toLowerCase()}
                        </div>
                    )}

                    {/* Due Date */}
                    {formattedDate && (
                        <div
                            className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                isOverdue
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        >
                            <Clock className="h-3 w-3" />
                            {formattedDate}
                        </div>
                    )}

                    {/* Description Icon */}
                    {card.description && (
                        <div className="text-gray-400" title="This card has a description">
                            <AlignLeft className="h-3.5 w-3.5" />
                        </div>
                    )}

                    {/* Checklist */}
                    {hasChecklist && (
                        <div
                            className={`flex items-center gap-1 text-[10px] font-medium ${
                                completedChecklistItems === totalChecklistItems
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            <CheckSquare className="h-3 w-3" />
                            {completedChecklistItems}/{totalChecklistItems}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <CardDetailModal
                    card={card}
                    listId={listId}
                    onClose={() => setIsModalOpen(false)}
                    onBoardUpdate={onBoardUpdate}
                />
            )}
        </>
    );
};

export default TodoCard;
