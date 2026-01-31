interface ICButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const CButton = ({
  text,
  variant = "secondary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
}: ICButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-primary-600 text-white shadow-sm",
    secondary: "bg-slate-100 text-slate-700",
    danger: "bg-red-50 text-red-600",
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""}`}
    >
      {text}
    </button>
  );
};

export default CButton;
