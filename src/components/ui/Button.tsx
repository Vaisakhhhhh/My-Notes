type Props = {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}

function Button({ children, onClick, className }: Props) {
    return (
        <button
            onClick={onClick}
            className={`py-2 px-3 ${className}`}
        >
            {children}
        </button>
    )
}

export default Button;