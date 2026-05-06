import { useEffect, useRef, useState } from "react";
import type { Note } from "../../types/note";
import TagChip from "../ui/TagChip";

type Props = {
    note: Note | null;
    onUpdateNote: (note: Note) => void;
};

function NoteEditor({ note, onUpdateNote }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const cursorPositions = useRef<Record<string, number>>({});
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (!note) return;

        const savedPos = cursorPositions.current[note.id];

        if (savedPos !== undefined && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(savedPos, savedPos);
        } else if (inputRef.current) {
            inputRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note?.id]);

    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white">
                Select or create a note
            </div>
        );
    }

    const handleChange = (field: "title" | "content", value: string) => {
        onUpdateNote({
            ...note,
            [field]: value,
            updatedAt: Date.now(),
        });
    };

    const handleCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        if (!note) return;
        cursorPositions.current[note.id] = e.currentTarget.selectionStart;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const value = tagInput.trim();

            if (!value) return;

            if (!note.tags.includes(value)) {
                onUpdateNote({
                    ...note,
                    tags: [...note.tags, value],
                    updatedAt: Date.now(),
                });
            }

            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        if (!note) return;

        onUpdateNote({
            ...note,
            tags: note.tags.filter(t => t !== tag),
            // eslint-disable-next-line react-hooks/purity
            updatedAt: Date.now(),
        });
    };

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 bg-white text-black dark:bg-gray-900 dark:text-white">
            <input
                ref={inputRef}
                type="text"
                value={note.title}
                onChange={e => handleChange("title", e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-gray-600 outline-none"
                placeholder="Title"
            />

            <div className="flex flex-wrap gap-2 p-2  rounded">

                {note.tags.map(tag => (
                    <TagChip
                        key={tag}
                        label={tag}
                        onRemove={() => removeTag(tag)}
                    />
                ))}

                <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none text-black"
                    placeholder="Add tag..."
                />
            </div>

            <textarea
                ref={textareaRef}
                value={note.content}
                onChange={e => {
                    handleChange("content", e.target.value);
                    handleCursor(e);
                }}
                onSelect={handleCursor}
                className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 resize-none"
                placeholder="Write your note..."
            />
        </div>
    );
}

export default NoteEditor;