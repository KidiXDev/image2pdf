interface ICButtonProps {
  text: string;
  bgColor?: string;
  hoverColor?: string;
  onClick?: () => void;
}

const CButton = ({
  text,
  bgColor = "#e7edf3",
  hoverColor = "#dfe5eb",
  onClick,
}: ICButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 transition-colors text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em]`}
      style={{
        backgroundColor: bgColor,
        color: "#0e141b",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
    >
      <span className="truncate">{text}</span>
    </button>
  );
};

export default CButton;
