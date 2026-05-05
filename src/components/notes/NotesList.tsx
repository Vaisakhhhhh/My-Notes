import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Note } from "../../types/note";
import React from "react";
import { useTheme } from "../../context/useTheme";

type Props = {
    notes: Note[];
    allTags: string[];
    activeNoteId: string | null;
    search: string;
    selectedTags: string[];
    onSearchNote: (id: string) => void;
    onSelectNote: (id: string) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
    onSelectTags: Dispatch<SetStateAction<string[]>>;
};

function NotesList({
    notes,
    allTags,
    activeNoteId,
    search,
    selectedTags,
    onSearchNote,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
    onSelectTags,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const MAX_VISIBLE_TAGS = 2;
    const visibleTags = selectedTags.slice(0, MAX_VISIBLE_TAGS);
    const remainingCount = selectedTags.length - visibleTags.length;
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-1/4 h-screen border-r border-gray-700 flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">

            {/* Top section (fixed) */}
            <div className="p-4">
                {/* Filter button + search + tags UI */}
                <button
                    onClick={toggleTheme}
                    className="px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded mb-2"
                >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => onSearchNote(e.target.value)}
                    className="w-full mb-4 p-2 bg-gray-800 text-white rounded"
                />

                <button
                    onClick={onCreateNote}
                    className="w-full mb-4 bg-blue-500 text-white py-2 rounded"
                >
                    + New Note
                </button>

                <div ref={dropdownRef} className="relative">
                    <div className="flex items-center justify-between">

                        {/* Left */}
                        <button
                            onClick={() => setIsOpen(prev => !prev)}
                            className="px-3 py-2 bg-gray-800 text-white rounded"
                        >
                            {selectedTags.length > 0 ? `Filter (${selectedTags.length})` : "Filter Tags"}
                        </button>

                        {/* Middle */}
                        <div className="flex items-center gap-2 overflow-visible">

                            {visibleTags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-blue-600 px-2 py-1 rounded text-xs whitespace-nowrap"
                                >
                                    {tag}
                                </span>
                            ))}

                            {remainingCount > 0 && (
                                <div className="relative group">
                                    <span className="text-xs text-gray-400 cursor-pointer">
                                        +{remainingCount} more
                                    </span>

                                    {/* Tooltip */}
                                    <div className="absolute hidden group-hover:block top-full mt-1 bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-20">
                                        {selectedTags.join(", ")}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right */}
                        {selectedTags.length > 0 && (
                            <button
                                onClick={() => onSelectTags([])}
                                className="text-red-400 hover:text-red-600"
                            >
                                ✕
                            </button>
                        )}

                    </div>

                    {isOpen && (
                        <div className="absolute w-48 bg-white border border-gray-700 rounded shadow-lg p-2 z-10">
                            {allTags.length === 0 ? (
                                <p className="text-gray-400 text-sm">No tags</p>
                            ) : (
                                allTags.map(tag => (
                                    <label
                                        key={tag}
                                        className="flex items-center gap-2 p-1 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => {
                                                onSelectTags((prev: string[]) =>
                                                    prev.includes(tag)
                                                        ? prev.filter(t => t !== tag)
                                                        : [...prev, tag]
                                                );
                                            }}
                                        />
                                        <span className="text-sm">{tag}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    )}
                </div>

            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
                {notes.map(note => (
                    <div
                        key={note.id}
                        className={`p-3 rounded cursor-pointer flex justify-between items-center ${note.id === activeNoteId
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300"
                            }`}
                        onClick={() => onSelectNote(note.id)}
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{note.title}</h3>

                            <p className="text-sm truncate">
                                {note.content || "No content"}
                            </p>

                            <div className="flex flex-wrap gap-1 mt-1">
                                {note.tags.slice(0, 3).map(tag => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-gray-700 px-2 py-1 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNote(note.id);
                            }}
                            className="text-red-400 hover:text-red-600 ml-2"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default React.memo(NotesList);