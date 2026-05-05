import { registerUser } from "@/store/userAction";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin } from "../api/auth.api";
import { BorderBeam } from "@/components/ui/border-beam";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    const result = await dispatch(
      registerUser({
        fullname: {
          firstname: data.firstname,
          lastname: data.lastname,
        },
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      reset();
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chart-1 px-4">
        <div className="relative mx-4 w-full max-w-97 overflow-hidden rounded-xl bg-white p-6 shadow-[0px_0px_10px_0px] shadow-black/10 md:p-8">
          <style>{`
          @keyframes shimmer {
            0% { background-position: -600px 0; }
            100% { background-position: 600px 0; }
          }
          .sk {
            background: linear-gradient(90deg, #e2e2e2 25%, #efefef 50%, #e2e2e2 75%);
            background-size: 1200px 100%;
            animation: shimmer 1.6s infinite linear;
          }
        `}</style>

          {/* Title */}
          <div className="sk mx-auto mb-8 h-8 w-36 rounded-md" />

          {/* Firstname + Lastname side by side */}
          <div className="flex gap-1 my-4">
            <div className="sk h-11 w-1/2 rounded-full" />
            <div className="sk h-11 w-1/2 rounded-full" />
          </div>

          {/* Username */}
          <div className="sk my-4 h-11 w-full rounded-full" />

          {/* Email */}
          <div className="sk my-4 h-11 w-full rounded-full" />

          {/* Password */}
          <div className="sk mt-2 h-11 w-full rounded-full" />

          {/* Create Account button */}
          <div className="sk mt-6 mb-2.5 h-10 w-full rounded-lg" />

          {/* OR divider */}
          <div className="flex items-center gap-2 my-2">
            <div className="sk h-px flex-1" />
            <div className="sk h-3 w-5 rounded-md" />
            <div className="sk h-px flex-1" />
          </div>

          {/* Google button */}
          <div className="sk mt-2 h-10 w-full rounded-lg" />

          {/* Login link */}
          <div className="sk mx-auto mt-4 h-3 w-44 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-chart-1">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative overflow-hidden bg-white text-gray-500 max-w-97 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-1">
          <input
            id="firstname"
            className="w-1/2 border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="text"
            {...register("firstname", { required: true })}
            placeholder="FirstName"
            required
          />

          <input
            id="lastname"
            className="w-1/2 border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="text"
            {...register("lastname", { required: true })}
            placeholder="LastName"
            required
          />
        </div>

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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 mb-2.5 cursor-pointer bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-2 w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
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

export default Register;
