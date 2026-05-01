import type { Note } from "../types/note";

type Props = {
    notes: Note[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
};

function NotesList({
    notes,
    activeNoteId,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
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
                        className={`p-3 rounded cursor-pointer flex justify-between items-center ${note.id === activeNoteId
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-300"
                            }`}
                        onClick={() => onSelectNote(note.id)}
                    >
                        <div>
                            <h3 className="font-semibold">{note.title}</h3>
                            <p className="text-sm truncate">{note.content || "No content"}</p>
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

export default NotesList;