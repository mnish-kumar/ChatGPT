import { MagicCard } from "@/components/ui/magic-card";
import { useForm } from "react-hook-form";

const Register = () => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    

    reset();
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-400">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white text-gray-500 max-w-97 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Register Now
        </h2>

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
        <div className="text-right py-4">
          <a className="text-blue-600 underline" href="#">
            Forgot Password
          </a>
        </div>
        <button
          type="submit"
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white cursor-pointer"
        >
          Register
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
