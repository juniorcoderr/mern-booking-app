import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      apiClient.resetPassword({ ...data, token: token || "" }),
    onSuccess: () => {
      showToast({ message: "Password reset successful", type: "SUCCESS" });
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
      <h2 className="text-3xl font-bold">Reset Password</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        New Password
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {watch("password") && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm New Password
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("confirmPassword", {
              validate: (val) => {
                if (!val) {
                  return "This field is required";
                } else if (watch("password") !== val) {
                  return "Passwords do not match";
                }
              },
            })}
          />
          {watch("confirmPassword") && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Reset Password
        </button>
      </span>
    </form>
  );
};

export default ResetPassword;
