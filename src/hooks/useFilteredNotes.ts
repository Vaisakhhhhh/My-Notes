import { useMemo } from "react";
import type { Note } from "../types/note";

type Params = {
    notes: Note[];
    search: string;
    selectedTags: string[];
}

export function useFilteredNotes({ notes, search, selectedTags }: Params) {
    return useMemo(() => {
        const searchTerm = search.toLowerCase();
        return notes
            .filter(note => {

                const matchesSearch =
                    note.title.toLowerCase().includes(searchTerm) ||
                    note.content.toLowerCase().includes(searchTerm);

                const matchesTag =
                    selectedTags.length === 0 ||
                    selectedTags.every(tag => note.tags.includes(tag));

                return matchesSearch && matchesTag;
            })
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }, [notes, search, selectedTags]);
};