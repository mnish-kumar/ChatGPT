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
  const { isLoading, error, twoFactorRequired, isAuthenticated } = useSelector((state) => state.user);

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

    if (loginUser.fulfilled.match(resultAction) && !resultAction.payload?.twoFactorRequired) {
      reset();
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
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
