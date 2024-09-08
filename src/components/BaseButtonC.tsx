interface CButtonProps {
  text: string;
  onClick?: () => void;
}

const CButton = ({ text, onClick }: CButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7edf3] hover:bg-[#dfe5eb] transition-colors text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em]"
    >
      <span className="truncate">{text}</span>
    </button>
  );
};

export default CButton;
