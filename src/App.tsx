import { useEffect, useState } from "react";
import type { Note } from "./types/note";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const searchTerm = search.toLowerCase();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm) ||
    note.content.toLowerCase().includes(searchTerm)
  );

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

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const newNotes = prev.filter((note) => note.id !== id);

      if (id === activeNoteId) {
        setActiveNoteId(newNotes[0]?.id || null);
      }

      return newNotes;
    });
  };

  return (
    <div className="flex gap-2">
      <NotesList
        notes={filteredNotes}
        activeNoteId={activeNoteId}
        search={search}
        onSearchNote={setSearch}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
      />
      <NoteEditor
        note={activeNote}
        onUpdateNote={updateNote}
      />
    </div>
  )
}

export default App
