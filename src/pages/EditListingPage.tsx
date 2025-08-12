// src/pages/EditListingPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { Listing, ApiResponse } from '../types/index.ts';

const EditListingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the listing ID from the URL
    const navigate = useNavigate();

    const [listing, setListing] = useState<Listing  | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state for general details
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

    // Form state for images
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [supportImageFiles, setSupportImageFiles] = useState<FileList | null>(null);
    const [isUpdatingThumbnail, setIsUpdatingThumbnail] = useState(false);
    const [isUpdatingSupportImages, setIsUpdatingSupportImages] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await api.get<ApiResponse<Listing>>(`/host/listings/${id}`);  // Assuming you have a GET /listings/:id endpoint
                const data = response.data.data;
                setListing(data);
                
                // Pre-populate form fields with existing data
                setTitle(data.title);
                setPrice(data.price);
                setDescription(data.description);
                setCountry(data.location.country);
                setCity(data.location.city);
                setAddress(data.location.address);
            } catch (error) {
                console.error('Failed to fetch listing:', error);
                toast.error('Failed to load listing details.');
                navigate('/host/listings');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id, navigate]);

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingDetails(true);
        try {
            const formData = {
                title,
                price,
                description,
                location: { country, city, address },
            };
            const response = await api.put(`/host/updateHostList/${id}`, formData);
            setListing(response.data.data); // Update local state with new data
            toast.success('Listing details updated successfully!');
        } catch (error) {
            console.error('Failed to update listing details:', error);
            toast.error('Failed to update listing details.');
        } finally {
            setIsUpdatingDetails(false);
        }
    };

    const handleUpdateThumbnail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!thumbnailFile) {
            toast.error('Please select a new thumbnail.');
            return;
        }

        setIsUpdatingThumbnail(true);
        try {
            const formData = new FormData();
            formData.append('thumbnail', thumbnailFile);
            
            const response = await api.put(`/host/updateThumbnail/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setListing(response.data.data);
            toast.success('Thumbnail updated successfully!');
        } catch (error) {
            console.error('Failed to update thumbnail:', error);
            toast.error('Failed to update thumbnail.');
        } finally {
            setIsUpdatingThumbnail(false);
        }
    };

    const handleUpdateSupportImages = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supportImageFiles || supportImageFiles.length === 0) {
            toast.error('Please select new support images.');
            return;
        }

        setIsUpdatingSupportImages(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < supportImageFiles.length; i++) {
                formData.append('supportImage', supportImageFiles[i]);
            }

            const response = await api.put(`/host/updateSupportImages/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setListing(response.data.data);
            toast.success('Support images updated successfully!');
        } catch (error) {
            console.error('Failed to update support images:', error);
            toast.error('Failed to update support images.');
        } finally {
            setIsUpdatingSupportImages(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading listing details...</div>;
    }

    if (!listing) {
        return <div className="text-center mt-10">Listing not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Listing: {listing.title}</h1>
            
            {/* General Details Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><PencilSquareIcon className="w-5 h-5" /> Update Details</h2>
                <form onSubmit={handleUpdateDetails} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                    </div>
                    <button type="submit" disabled={isUpdatingDetails} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                        {isUpdatingDetails ? 'Updating...' : 'Update Details'}
                    </button>
                </form>
            </div>
            
            {/* Thumbnail Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><PhotoIcon className="w-5 h-5" /> Update Thumbnail</h2>
                <div className="mb-4">
                    <img src={listing.thumbnail} alt="Current Thumbnail" className="w-full h-48 object-cover rounded-lg" />
                </div>
                <form onSubmit={handleUpdateThumbnail} className="flex items-end space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Choose New Thumbnail</label>
                        <input type="file" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="mt-1" accept="image/*" required />
                    </div>
                    <button type="submit" disabled={isUpdatingThumbnail} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                        {isUpdatingThumbnail ? 'Uploading...' : 'Update Thumbnail'}
                    </button>
                </form>
            </div>

            {/* Support Images Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><PhotoIcon className="w-5 h-5" /> Update Support Images</h2>
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.supportImage.map((img: string, index: number) => (
                        <img key={index} src={img} alt={`Support Image ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                    ))}
                </div>
                <form onSubmit={handleUpdateSupportImages} className="flex items-end space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Choose New Support Images (up to 3)</label>
                        <input type="file" multiple onChange={(e) => setSupportImageFiles(e.target.files)} className="mt-1" accept="image/*" required />
                    </div>
                    <button type="submit" disabled={isUpdatingSupportImages} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                        {isUpdatingSupportImages ? 'Uploading...' : 'Update Images'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditListingPage;