import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type ForgotPasswordFormData = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const mutation = useMutation({
    mutationFn: apiClient.forgotPassword,
    onSuccess: () => {
      showToast({
        message: "Password reset link sent to your email",
        type: "SUCCESS",
      });
      navigate("/sign-in");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Forgot Password</h2>
      <p className="text-gray-600">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Send Reset Link
        </button>
      </span>
    </form>
  );
};

export default ForgotPassword;
