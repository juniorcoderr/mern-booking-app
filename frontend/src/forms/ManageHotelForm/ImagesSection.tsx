import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<HotelFormData>();

  const imageFiles = watch("imageFiles");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length;

              if (totalLength === 0) {
                return "At least one image should be added";
              }

              if (totalLength > 6) {
                return "Total number of images cannot be more than 6";
              }

              return true;
            },
          })}
        />
        {imageFiles && (
          <p className="text-gray-600 mt-2">
            {imageFiles.length} file{imageFiles.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
