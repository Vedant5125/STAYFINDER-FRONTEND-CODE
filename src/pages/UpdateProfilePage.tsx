// src/pages/UpdateProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { CameraIcon, UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

const UpdateProfilePage: React.FC = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isDetailsUpdating, setIsDetailsUpdating] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [isProfileImageUpdating, setIsProfileImageUpdating] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/getCurrentUser');
                const userData = response.data.data;
                setFullname(userData.fullname);
                setEmail(userData.email);
                setPhone(userData.phone);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setUser]);

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDetailsUpdating(true);
        try {
            const response = await api.post('/users/updateAccountDetails', { fullname, email, phone });
            setUser(response.data.data);
            toast.success('Account details updated successfully! 🎉');
        } catch (error) {
            console.error('Update details error:', error);
            toast.error('Failed to update details.');
        } finally {
            setIsDetailsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordUpdating(true);
        try {
            await api.post('/users/updatePassword', { oldPassword, newPassword });
            setOldPassword('');
            setNewPassword('');
            toast.success('Password changed successfully! 🔐');
        } catch (error) {
            console.error('Update password error:', error);
            toast.error('Failed to change password.');
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const handleUpdateProfileImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileImageFile) {
            toast.warn('Please select a new image first.');
            return;
        }

        setIsProfileImageUpdating(true);
        try {
            const formData = new FormData();
            formData.append('profile', profileImageFile);

            const response = await api.post('/users/updateprofileImage', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUser(response.data.data);
            setProfileImageFile(null);
            toast.success('Profile image updated successfully! 📸');
        } catch (error) {
            console.error('Update profile image error:', error);
            toast.error('Failed to update profile image.');
        } finally {
            setIsProfileImageUpdating(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-600">Loading user data...</div>;
    }
    
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
                    <p className="mt-2 text-sm text-gray-600">Manage your account settings and update your information.</p>
                </div>
                
                {/* Profile Image Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center">
                    <img
                        src={user?.profile || 'https://via.placeholder.com/150'}
                        alt="User Profile"
                        className="h-32 w-32 rounded-full object-cover mb-4 ring-4 ring-primary-500 ring-offset-2"
                    />
                    <h3 className="text-2xl font-bold text-gray-900">{user?.fullname}</h3>
                    <p className="text-gray-600 mt-1">{user?.email}</p>

                    <form onSubmit={handleUpdateProfileImage} className="mt-6 w-full max-w-md">
                        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Change Profile Picture</label>
                        <div className="mt-1 flex items-center space-x-3">
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && setProfileImageFile(e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                            <button
                                type="submit"
                                disabled={isProfileImageUpdating}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                <CameraIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                {isProfileImageUpdating ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Personal Details Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <UserCircleIcon className="h-6 w-6 text-primary-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
                    </div>
                    <form onSubmit={handleUpdateDetails} className="space-y-4">
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                id="fullname"
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                id="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isDetailsUpdating}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {isDetailsUpdating ? 'Saving...' : 'Update Details'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <KeyIcon className="h-6 w-6 text-primary-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                    </div>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                id="oldPassword"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPasswordUpdating}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {isPasswordUpdating ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfilePage;