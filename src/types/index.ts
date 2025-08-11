export interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  profile: string;
  role: 'user' | 'host';
  wishList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  country: string;
  city: string;
  address: string;
}

export interface Listing {
  _id: string;
  host: string;
  title: string;
  description: string;
  price: number;
  location: Location;
  type: 'apartment' | 'house' | 'villa' | 'cabin' | 'bungalow' | 'room';
  thumbnail: string;
  supportImage: string[];
  guest: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  user: string;
  listing: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookedDate {
  checkIn: string;
  checkOut: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}