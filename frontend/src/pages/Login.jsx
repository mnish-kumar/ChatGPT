import { loginUser } from "@/store/userAction";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BorderBeam } from "@/components/ui/border-beam";
import { googleLogin } from "../api/auth.api";
import { useEffect, useState } from "react";
import { LoginSkeleton } from "@/components/skeletons";
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

  const [showPassword, setShowPassword] = useState(false);

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

  if (isLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-chart-1 px-4 text-foreground">
      <div
        className="relative flex items-center justify-center w-full max-w-md rounded-2xl min-h-[600px]"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(120,80,255,0.15)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => navigate("/")}
          className="absolute bg-gray-500 top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm cursor-pointer transition"
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          ✕
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mx-4 w-full max-w-89 overflow-hidden rounded-xl border border-border bg-card p-4 text-left text-sm text-muted-foreground shadow-sm md:p-6"
        >
          <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
            Login
          </h2>

          {/* Server error */}
          {error && !twoFactorRequired && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-3">
            <input
              id="username"
              className="w-full rounded-full border border-input bg-background px-4 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-0 focus:outline-none"
              style={{ boxShadow: "none" }}
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="mt-1.5 ml-2 text-xs text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              id="email"
              className="w-full rounded-full border border-input bg-background px-4 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-0 focus:outline-none"
              style={{ boxShadow: "none" }}
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1.5 ml-2 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-1">
            <div className="relative">
              <input
                id="password"
                className="w-full rounded-full border border-input bg-background px-4 py-2.5 pr-11 text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-0 focus:outline-none"
                style={{ boxShadow: "none" }}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 ml-2 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

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
            onClick={googleLogin}
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
      </div>

      {twoFactorRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Verify2FA />
        </div>
      )}
    </div>
  );
};

export default Login;