import { useEffect, useRef } from "react";
import type { Note } from "../types/note";

type Props = {
    note: Note | null;
    onUpdateNote: (note: Note) => void;
};

function NoteEditor({ note, onUpdateNote }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [note?.id]);

    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
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
    };;

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <input
                ref={inputRef}
                type="text"
                value={note.title}
                onChange={e => handleChange("title", e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-gray-600 outline-none"
                placeholder="Title"
            />

            <textarea
                value={note.content}
                onChange={e => handleChange("content", e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-300 resize-none"
                placeholder="Write your note..."
            />
        </div>
    );
}

export default NoteEditor;