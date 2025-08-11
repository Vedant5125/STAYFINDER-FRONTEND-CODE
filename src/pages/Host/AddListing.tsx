import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PhotoIcon, 
  // XMarkIcon 
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const addListingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['apartment', 'house', 'villa', 'cabin', 'bungalow', 'room']),
  guest: z.number().min(1, 'Must accommodate at least 1 guest'),
  thumbnail: z.any().refine((files) => files?.length > 0, 'Thumbnail image is required'),
  supportImg: z.any().optional(),
});

type AddListingFormData = z.infer<typeof addListingSchema>;

const AddListing: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [supportImagePreviews, setSupportImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // setError,
    watch,
  } = useForm<AddListingFormData>({
    resolver: zodResolver(addListingSchema),
  });

  const thumbnailFiles = watch('thumbnail');
  const supportImgFiles = watch('supportImg');

  React.useEffect(() => {
    if (thumbnailFiles && thumbnailFiles.length > 0) {
      const file = thumbnailFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [thumbnailFiles]);

  React.useEffect(() => {
    if (supportImgFiles && supportImgFiles.length > 0) {
      const previews: string[] = [];
      Array.from(supportImgFiles as FileList).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === supportImgFiles.length) {
            setSupportImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setSupportImagePreviews([]);
    }
  }, [supportImgFiles]);

  const onSubmit = async (data: AddListingFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('location.country', data.country);
      formData.append('location.city', data.city);
      formData.append('location.address', data.address);
      formData.append('type', data.type);
      formData.append('guest', data.guest.toString());
      formData.append('thumbnail', data.thumbnail[0]);


if (data.supportImg && data.supportImg.length > 0) {
  Array.from(data.supportImg as File[]).forEach((file) => {
    formData.append('supportImg', file);
  });
}
      await api.post('/host/uploadStay', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Listing created successfully!');
      navigate('/host/listings');
    } catch (error) {
      console.error('Error fetching host listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Listing</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="input-field"
                  placeholder="Enter a catchy title for your listing"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your property in detail"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per night ($)
                  </label>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="input-field"
                    placeholder="0"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum guests
                  </label>
                  <input
                    {...register('guest', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="input-field"
                    placeholder="1"
                  />
                  {errors.guest && (
                    <p className="mt-1 text-sm text-red-600">{errors.guest.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select {...register('type')} className="input-field">
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="bungalow">Bungalow</option>
                  <option value="room">Room</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    {...register('country')}
                    type="text"
                    className="input-field"
                    placeholder="Enter country"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    className="input-field"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="input-field"
                  placeholder="Enter full address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Images</h2>
              
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image (Required)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      {...register('thumbnail')}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">
                    {/* {errors.thumbnail.message} */}
                    {errors.title?.message as string}
                    </p>
                )}
              </div>

              {/* Support Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Optional, max 3)
                </label>
                <input
                  {...register('supportImg')}
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                
                {supportImagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {supportImagePreviews.map((preview, index) => (
                      <div key={index} className="w-full h-24 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt={`Support image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/host/listings')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;