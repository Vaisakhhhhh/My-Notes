import type { Note } from "../types/note";

type Props = {
    notes: Note[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
    onCreateNote: () => void;
};

function NotesList({
    notes,
    activeNoteId,
    onSelectNote,
    onCreateNote,
}: Props) {
    return (
        <div className="w-1/3 h-screen border-r border-gray-700 p-4">
            <button
                onClick={onCreateNote}
                className="w-full mb-4 bg-blue-500 text-white py-2 rounded"
            >
                + New Note
            </button>

            <div className="space-y-2">
                {notes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => onSelectNote(note.id)}
                        className={`p-3 rounded cursor-pointer ${note.id === activeNoteId
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-300"
                            }`}
                    >
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm truncate">{note.content || "No content"}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NotesList;