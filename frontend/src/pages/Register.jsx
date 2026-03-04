import axios from "axios";
import { LockKeyhole, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Register = () => {
  const { register, reset, handleSubmit } = useForm();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const onSubmit = (data) => {
    const formatedData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
    };

    axios
      .post(`${BASE_URL}/api/auth/register`, formatedData, { withCredentials: true })
      .then((response) => {
        console.log("Registration successful:", response.data);
        reset();
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration error:", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-(--primary-color)">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-(--secondary-color) text-(--text-color) w-full max-w-85 mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Create an Account
        </h2>

        <div className="flex items-center w-full  border-(--border-color) h-12 mt-4 gap-1">
          <div className="flex items-center w-full bg-white border border-(--border-color) h-12 rounded-full overflow-hidden pl-6">
            <User className="w-4 h-4 text-(--muted-text-color)" />

            <input
              type="text"
              name="firstname"
              placeholder="FirstName"
              className="w-full border-none outline-none ring-0 pl-1 text-(--text-color) placeholder:text-(--muted-text-color)"
              {...register("firstname", { required: true })}
            />
          </div>
          <div className="flex items-center w-full bg-white border border-(--border-color) h-12 rounded-full overflow-hidden pl-6">
            <User className="w-4 h-4 text-(--muted-text-color)" />

            <input
              type="text"
              name="lastname"
              placeholder="LastName"
              className="w-full border-none outline-none ring-0 rounded-full overflow-hidden pl-1 text-(--text-color) placeholder:text-(--muted-text-color)"
              {...register("lastname", { required: true })}
            />
          </div>
        </div>

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
          <LockKeyhole className="w-4 h-4 text-(--muted-text-color)" />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 text-(--text-color) placeholder:text-(--muted-text-color)"
            {...register("password", { required: true })}
          />
        </div>

        <button className="mt-2 w-full h-11 rounded-full text-white bg-(--accent-color) hover:bg-(--accent-hover) cursor-pointer transition-colors hover:scale-101">
          Sign Up
        </button>

        <p className="text-center mt-4 text-gray-450">
          Have an account?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-blue-500 underline cursor-pointer"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;

