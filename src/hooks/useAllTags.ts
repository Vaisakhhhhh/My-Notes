import { useMemo } from "react";
import type { Note } from "../types/note";

export function useAllTags (notes: Note[]) {
    return useMemo(() => {
        return [...new Set(notes.flatMap(note => note.tags))]
          .sort((a, b) => a.localeCompare(b));
      }, [notes]);
};