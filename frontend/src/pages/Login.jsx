import { loginUser } from "@/store/userAction";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BorderBeam } from "@/components/ui/border-beam";
import { googleLogin } from "../api/auth.api";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.user);

  const onSubmit = (data) => {
    const result = dispatch(
      loginUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      reset();
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-400">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative overflow-hidden bg-white text-gray-500 max-w-89 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Login
        </h2>

        <input
          id="username"
          className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="text"
          placeholder="Enter your username"
          {...register("username", { required: true })}
          required
        />
        <input
          id="email"
          className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}

        <input
          id="password"
          className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: true })}
          required
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}


        <div className="text-right py-4">
          <a className="text-blue-600 underline" href="#">
            Forgot Password
          </a>
        </div>

        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center gap-2 my-5">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </button>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>

        <BorderBeam
          duration={6}
          size={400}
          borderWidth={2}
          className={"from-transparent via-red-700 to-transparent"}
        />
        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          borderWidth={3}
          className={"from-transparent via-blue-500 to-transparent"}
        />
      </form>
    </div>
  );
};

export default Login;
