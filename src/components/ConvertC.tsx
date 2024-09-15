interface ConvertCProps {
  imageSrc: string;
  altText?: string;
  imageName?: string;
  width?: number;
  height?: number;
}

const ConvertC: React.FC<ConvertCProps> = ({
  imageSrc,
  altText = "Image",
  imageName = "image.jpg",
  width = 176,
  height = 220,
}) => {
  return (
    <div
      className={`flex flex-col items-center transform transition-transform duration-300 hover:scale-105 cursor-grab`}
    >
      <div
        className="relative overflow-hidden rounded-lg shadow-xl border-2 max-w-[344px] max-h-[430px]"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-50"></div>
      </div>
      <span className="truncate max-w-40">{imageName}</span>
    </div>
  );
};

export default ConvertC;
