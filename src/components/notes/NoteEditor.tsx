import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

import { useState, useEffect } from "react";
import type { Note } from "../../types/note";

import TagChip from "../ui/TagChip";
import Toolbar from './Toolbar';


const CustomTaskList = TaskList.extend({
    addAttributes() {
        return {
            strikethrough: {
                default: false,
                parseHTML: element => element.hasAttribute('data-strikethrough'),
                renderHTML: attributes => {
                    if (!attributes.strikethrough) {
                        return {};
                    }
                    return {
                        'data-strikethrough': 'true',
                        class: 'strikethrough-list',
                    };
                },
            },
        };
    },
});

type Props = {
    note: Note | null;
    onUpdateNote: (note: Note) => void;
};

function NoteEditor({ note, onUpdateNote }: Props) {
    const [tagInput, setTagInput] = useState("");

    //^ Initialize Tiptap editor

    const editor = useEditor({
        extensions: [
            StarterKit,
            CustomTaskList,
            TaskItem.configure({
                nested: true,
            }),
            TextStyle,
            Color,
        ],
        content: note?.content,
        onUpdate({ editor }) {
            handleChange("content", editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none max-w-none dark:prose-invert',
            },
        },
    });

    // Update editor content when switching notes
    useEffect(() => {
        if (editor && note && note.content !== editor.getHTML()) {
            editor.commands.setContent(note.content || '');
        }
    }, [editor, note?.id]);


    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white">
                Select or create a note
            </div>
        );
    }


    //^ Handle content changes

    const handleChange = (field: "title" | "content", value: string) => {
        onUpdateNote({
            ...note,
            [field]: value,
            updatedAt: Date.now(),
        });
    };


    //^ Tag handling

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const value = tagInput.trim();

            if (!value) return;

            if (!note.tags.includes(value)) {
                onUpdateNote({
                    ...note,
                    tags: [...note.tags, value],
                    updatedAt: Date.now(),
                });
            }

            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        if (!note) return;

        onUpdateNote({
            ...note,
            tags: note.tags.filter(t => t !== tag),
            // eslint-disable-next-line react-hooks/purity
            updatedAt: Date.now(),
        });
    };



    return (
        <div className="flex-1 p-4 flex flex-col gap-4 bg-white text-black dark:bg-gray-900 dark:text-white">
            <input
                type="text"
                value={note.title}
                onChange={e => handleChange("title", e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-gray-600 outline-none"
                placeholder="Title"
            />

            <div className="flex flex-wrap gap-2 p-2  rounded">

                {note.tags.map(tag => (
                    <TagChip
                        key={tag}
                        label={tag}
                        onRemove={() => removeTag(tag)}
                    />
                ))}

                <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none text-black"
                    placeholder="Add tag..."
                />
            </div>

            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-visible w-full">
                <Toolbar editor={editor} />
                <div className="flex-grow">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
}

export default NoteEditor;