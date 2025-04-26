const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2.5">
      <div>
        <h1 className="logotext text-center text-5xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-[#9696FA] via-white to-[#9696FA] animate-gradient">
          CHATIFY
        </h1>
        <h3 className="text-xs text-center lg:text-xl italic bg-clip-text text-transparent bg-gradient-to-r from-[#9696FA] via-white to-[#9696FA] animate-gradient">
          Seamless Conversations, Anytime, Anywhere.
        </h3>
      </div>
    </div>
  );
};

export default NoChatSelected;