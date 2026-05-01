import { useState } from "react";
import type { Note } from "./types/note";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <NotesList />
      <NoteEditor />
    </div>
  )
}

export default App
