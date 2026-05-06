import { useState } from "react";
import type { Note } from "./types/note";
import NotesList from "./components/notes/NotesList";
import NoteEditor from "./components/notes/NoteEditor";
import { useNotes } from "./hooks/useNotes";
import { useFilteredNotes } from "./hooks/useFilteredNotes";
import { useAllTags } from "./hooks/useAllTags";

function App() {
  const { notes, setNotes } = useNotes();
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;
  
  const filteredNotes = useFilteredNotes({
    notes,
    search,
    selectedTags,
  });
  
  const allTags = useAllTags(notes);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      tags: [],
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
    <div className="flex">
      <NotesList
        notes={filteredNotes}
        allTags={allTags}
        activeNoteId={activeNoteId}
        search={search}
        selectedTags={selectedTags}
        onSearchNote={setSearch}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        onSelectTags={setSelectedTags}
      />
      <NoteEditor
        note={activeNote}
        onUpdateNote={updateNote}
      />
    </div>
  )
}

export default App
