import React, { createContext, useEffect, useState } from 'react';
import type { User, AuthResponse } from '../types/index.ts';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string, phone?: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  setUser: (user: User | null) => void;
}

interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  profile: File;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);



const checkAuthStatus = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const response = await api.get('/users/getCurrentUser');

            // --- Corrected Log to see the actual data from the server ---
            console.log("Backend response data:", response.data);

            // Assuming your backend sends the user object at response.data.data
            if (response.data && response.data.data) {
                setUser(response.data.data);
                console.log("User state successfully updated!");
            } else {
                // This block will run if the data is not in the expected format
                console.log("Response data is empty or invalid. Logging out.");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
            }
        } else {
            console.log("No token found. User is logged out.");
            setUser(null);
        }
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    } finally {
        setLoading(false);
    }
};

  const login = async (email: string, password: string, role: string, phone?: string) => {
  try {
    const loginData = phone ? { phone, password, role } : { email, password, role };
    const response = await api.post<{ data: AuthResponse }>('/users/login', loginData);

    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);

    toast.success('Login successful!');
  } 
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    throw error;
  }

};


const register = async (data: RegisterData) => {
  try {
    const formData = new FormData();
    formData.append('fullname', data.fullname);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone);
    formData.append('role', data.role);
    formData.append('profile', data.profile);

    await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Registration successful! Please login.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    throw error;
  }
};


  const logout = async () => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.error('Failed to fetch current user:', error);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export{ AuthContext };