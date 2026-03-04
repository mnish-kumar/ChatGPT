import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-sm max-md:px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-400 to-gray-700 bg-clip-text text-transparent">
        404 Not Found
      </h1>
      <div className="h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
      <p className="md:text-xl text-gray-400 max-w-lg text-center">
        The page you are looking for does not exist or please login first.
      </p>
      <button
        className="group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all"
        onClick={() => navigate("/")}
      >
        Back to Home
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ErrorPage;
