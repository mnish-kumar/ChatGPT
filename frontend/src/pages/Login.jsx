import { loginUser } from "@/store/userAction";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BorderBeam } from "@/components/ui/border-beam";
import { googleLogin } from "../api/auth.api";
import { useEffect } from "react";
import Verify2FA from "@/pages/user/2FA/Verify2FA";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, twoFactorRequired, isAuthenticated } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(
      loginUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    );

    if (
      loginUser.fulfilled.match(resultAction) &&
      !resultAction.payload?.twoFactorRequired
    ) {
      reset();
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  // isLoading
  if (isLoading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chart-1 px-4">
      <div className="relative mx-4 w-full max-w-89 overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
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
          .dark .sk {
            background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            background-size: 1200px 100%;
          }
        `}</style>

        {/* Title */}
        <div className="sk mx-auto mb-8 h-8 w-20 rounded-md" />

        {/* Username */}
        <div className="sk my-4 h-11 w-full rounded-full" />

        {/* Email */}
        <div className="sk my-4 h-11 w-full rounded-full" />

        {/* Password */}
        <div className="sk mt-2 h-11 w-full rounded-full" />

        {/* Forgot password */}
        <div className="sk ml-auto mt-5 mb-5 h-3 w-28 rounded-md" />

        {/* Login button */}
        <div className="sk h-10 w-full rounded-lg" />

        {/* OR divider */}
        <div className="my-6 flex items-center gap-2">
          <div className="sk h-px flex-1" />
          <div className="sk h-3 w-5 rounded-md" />
          <div className="sk h-px flex-1" />
        </div>

        {/* Google button */}
        <div className="sk h-10 w-full rounded-lg" />

        {/* Register link */}
        <div className="sk mx-auto mt-5 h-3 w-40 rounded-md" />
      </div>
    </div>
  );
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-chart-1 px-4 text-foreground">
      {error && !twoFactorRequired && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-4 max-w-89 overflow-hidden rounded-xl border border-border bg-card p-4 text-left text-sm text-muted-foreground shadow-sm md:p-6"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
          Login
        </h2>

        <input
          id="username"
          className="my-3 w-full rounded-full border border-input bg-background px-4 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          type="text"
          placeholder="Enter your username"
          {...register("username", { required: true })}
          required
        />
        <input
          id="email"
          className="my-3 w-full rounded-full border border-input bg-background px-4 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          required
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}

        <input
          id="password"
          className="mt-1 w-full rounded-full border border-input bg-background px-4 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: true })}
          required
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}

        <div className="text-right py-4">
          <a
            className="text-primary underline underline-offset-4 hover:text-primary/80 cursor-pointer"
            onClick={() => navigate("/forget-password")}
          >
            Forgot Password
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center gap-2 my-5">
          <hr className="flex-1 border-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <hr className="flex-1 border-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm font-medium text-foreground transition hover:bg-muted"
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
          <a
            href="/register"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
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

      {twoFactorRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Verify2FA />
        </div>
      )}
    </div>
  );
};

export default Login;
