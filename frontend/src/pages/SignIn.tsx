import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export type SignInFormData = {
  email: string;
  password: string;
  role: "admin" | "customer";
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [role, setRole] = useState<"admin" | "customer">("customer");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation<unknown, Error, SignInFormData>({
    mutationFn: apiClient.signIn,
    onSuccess: async () => {
      showToast({ message: "Sign In Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate({ ...data, role });
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 text-sm font-bold">Select Role</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="customer"
              checked={role === "customer"}
              onChange={(e) => setRole(e.target.value as "admin" | "customer")}
              className="mr-2"
            />
            Customer
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.value as "admin" | "customer")}
              className="mr-2"
            />
            Hotel Admin
          </label>
        </div>
      </div>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Registered?{" "}
          <Link className="underline" to="/register">
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          LogIn
        </button>
      </span>
    </form>
  );
};

export default SignIn;
