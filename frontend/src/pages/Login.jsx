import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LockIcon, Mail } from "lucide-react";
import "../App.css";
import { useAuth } from "../auth/hooks/useauth";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();
  const { handleLogin, isSubmitting } = useAuth();

  const onSubmit = async (data) => {
    const result = await handleLogin({ email: data.email, password: data.password });
    if (result.success) {
      reset();
      navigate("/");
    } else {
      const errorMsg = result.error?.message || "Invalid email or password";
      // Check if error is about email or password specifically
      if (errorMsg.toLowerCase().includes("email")) {
        setError("email", { type: "server", message: errorMsg });
      } else if (errorMsg.toLowerCase().includes("password")) {
        setError("password", { type: "server", message: errorMsg });
      } else {
        setError("root", { type: "server", message: errorMsg });
      }
    }
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
            {...register("email", { required: "Email is required" })}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>
        )}

        <div className="flex items-center mt-4 w-full bg-white border border-(--border-color) h-12 rounded-full overflow-hidden pl-6 gap-2">
          <LockIcon className="w-4 h-4 text-(--muted-text-color)" />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 text-(--text-color) placeholder:text-(--muted-text-color)"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</p>
        )}

        {errors.root && (
          <p className="text-red-500 text-sm mt-2 text-left">{errors.root.message}</p>
        )}

        <div className="mt-4 text-left text-blue-500 ">
          <button className="text-sm cursor-pointer" type="reset">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full h-11 rounded-full text-white bg-(--accent-color) hover:bg-(--accent-hover) hover:scale-95 duration-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-600 text-sm mt-3 mb-11">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline cursor-pointer no-underline"
          >
            click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

