import type { Note } from "../../types/note";

type Props = {
    notes: Note[];
    activeNoteId: string | null;
    search: string;
    onSearchNote: (id: string) => void;
    onSelectNote: (id: string) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
};

function NotesList({
    notes,
    activeNoteId,
    search,
    onSearchNote,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
}: Props) {
    return (
        <div className="w-1/3 max-w-sm h-screen border-r border-gray-700 p-4 overflow-hidden">
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

export default NotesList;