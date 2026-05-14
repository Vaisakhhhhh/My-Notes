import { useState, useEffect, type ReactNode } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  ListChecks,
  Palette
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  title 
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  children: ReactNode,
  title: string 
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
    }`}
  >
    {children}
  </button>
);

const Toolbar = ({ editor }: ToolbarProps) => {
  const [, forceUpdate] = useState({});
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      forceUpdate({});
    };

    editor.on('transaction', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('transaction', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }


  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#64748b' }
  ];

  const toggleColorPicker = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setIsColorPickerOpen(false);
  };

  const handleNormalTaskList = () => {
    if (editor.isActive('taskList', { strikethrough: true })) {
      editor.chain().focus().updateAttributes('taskList', { strikethrough: false }).run();
    } else {
      editor.chain().focus().toggleTaskList().run();
    }
  };

  const handleStrikethroughTaskList = () => {
    if (editor.isActive('taskList', { strikethrough: false })) {
      editor.chain().focus().updateAttributes('taskList', { strikethrough: true }).run();
    } else if (editor.isActive('taskList', { strikethrough: true })) {
      editor.chain().focus().toggleTaskList().run();
    } else {
      editor.chain().focus().toggleTaskList().updateAttributes('taskList', { strikethrough: true }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-gray-800 rounded-t-xl">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={handleNormalTaskList}
        isActive={editor.isActive('taskList', { strikethrough: false })}
        title="Normal Task List"
      >
        <CheckSquare size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={handleStrikethroughTaskList}
        isActive={editor.isActive('taskList', { strikethrough: true })}
        title="Strikethrough Task List"
      >
        <ListChecks size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

      {/* Color Picker */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleColorPicker}
          title="Text Color"
          className="p-2 rounded-md transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100 flex items-center gap-1"
        >
          <Palette size={18} />
        </button>

        {isColorPickerOpen && (
          <div className="absolute top-full mt-1 left-0 z-10 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-2 flex gap-1">
            {colors.map((color) => (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <button 
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:scale-110 transition-transform flex items-center justify-center text-xs text-slate-400 dark:text-slate-500"
                title="Reset Color"
            >
                ✕
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Toolbar;
