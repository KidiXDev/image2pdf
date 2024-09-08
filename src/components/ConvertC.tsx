const ConvertC = ({ imageExist }: { imageExist: boolean }) => {
  return (
    <div className={imageExist ? "block" : "hidden"}>
      <div className="px-40 flex justify-center py-5">
        <div className="relative w-[264px] h-[330px] overflow-hidden">
          <img
            src="../../public/test.jpg"
            alt="turu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default ConvertC;
