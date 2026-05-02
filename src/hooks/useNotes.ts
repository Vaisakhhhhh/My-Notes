import { useState, useEffect } from "react";
import type { Note } from "../types/note";


export function useNotes() {
    const [notes, setNotes] = useState<Note[]>(() => {
        const savedNotes = localStorage.getItem('notes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    return { notes, setNotes };
}