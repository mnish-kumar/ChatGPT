import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LockIcon, Mail } from "lucide-react";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const onSubmit = (data) => {
    axios
      .post(`${BASE_URL}/api/auth/login`, data, { withCredentials: true })
      .then((response) => {
        console.log("Login successful:", response.data);
        navigate("/"); // Redirect to home page after successful login
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
      
    reset();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-(--primary-color)">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:w-87.5 w-full text-center border border-(--border-color) rounded-2xl px-8 bg-(--secondary-color)"
      >
        <h1 className="text-(--text-color) text-3xl mt-10 font-medium">Login</h1>
        <p className="text-(--muted-text-color) text-sm mt-2">
          Please Login in to continue
        </p>
        <div className="flex items-center w-full mt-4 bg-white border border-(--border-color) h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail className="w-4 h-4 text-(--muted-text-color)" />

          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0 text-(--text-color) placeholder:text-(--muted-text-color)"
            {...register("email", { required: true })}
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-(--border-color) h-12 rounded-full overflow-hidden pl-6 gap-2">
          <LockIcon className="w-4 h-4 text-(--muted-text-color)" />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 text-(--text-color) placeholder:text-(--muted-text-color)"
            {...register("password", { required: true })}
          />
        </div>

        <div className="mt-4 text-left text-blue-500 ">
          <button className="text-sm cursor-pointer" type="reset">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-(--accent-color) hover:bg-(--accent-hover) hover:scale-95 duration-500  cursor-pointer transition-colors"
        >
          Login
        </button>

        <p className="text-gray-600 text-sm mt-3 mb-11">
          Don't have an account?
          <a
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            click here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

