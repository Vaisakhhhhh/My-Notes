type Props = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

function TagChip({ label, onRemove, className }: Props) {
  return (
    <span className={`flex items-center gap-1 px-2 py-1 ${className} bg-blue-600 text-white rounded text-xs`}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      )}
    </span>
  );
}

export default TagChip;