import type { Note } from "../types/note";

type Props = {
    note: Note | null;
}

function NoteEditor({ note }: Props) {
    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select or create a note
            </div>
        );
    }

    return (
        <div className="flex-1 p-4">
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p className="mt-2 text-gray-400">{note.content || "Empty note"}</p>
        </div>
    );
}

export default NoteEditor;