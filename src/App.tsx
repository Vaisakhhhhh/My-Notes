import { useState } from "react";
import type { Note } from "./types/note";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      updatedAt: Date.now(),
    };

    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(prev => 
      prev.map((note) => 
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  return (
    <div className="flex gap-2">
      <NotesList 
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
      />
      <NoteEditor 
        note={activeNote}
        onUpdateNote={updateNote}
      />
    </div>
  )
}

export default App
