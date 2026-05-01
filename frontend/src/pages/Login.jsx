import { loginUser } from "@/store/userAction";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-400">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-gray-500 max-w-89 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
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
        <input
          id="password"
          className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: true })}
          required
        />
        <div className="text-right py-4">
          <a className="text-blue-600 underline" href="#">
            Forgot Password
          </a>
        </div>
        <button
          type="submit"
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white cursor-pointer"
        >
          Login
        </button>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
