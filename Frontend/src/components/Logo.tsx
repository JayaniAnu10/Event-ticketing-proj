import { Calendar } from "lucide-react";

const Logo = () => {
  return (
    <div>
      <div className="flex p-3 gap-2 items-center">
        <div className="bg-linear-to-r mx-1 my-1 from-violet-800 to-rose-700 rounded-full w-10 h-10  hover:scale-110 transition-transform duration-300">
          <Calendar className="w-6 h-6 mx-auto my-2 text-white" />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-800 to-rose-700">
          Eventra
        </span>
      </div>
    </div>
  );
};

export default Logo;
