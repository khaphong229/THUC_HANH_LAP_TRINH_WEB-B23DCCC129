import axios from 'axios';
import { Destination, Itinerary } from './typings';

const API_URL = 'https://681c1b296ae7c794cf70afff.mockapi.io/trip';

export const getDestinations = async (filters?: {
  type?: string;
  minRating?: number;
  maxPrice?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (filters?.type) queryParams.append('type', filters.type);
  if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
  if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await axios.get(`${API_URL}/destinations${query}`);
  return response;
};

export const getDestination = async (id: string) => {
  const response = await axios.get(`${API_URL}/destinations/${id}`);
  return response;
};


export const getItineraries = async () => {
  const response = await axios.get(`${API_URL}/itineraries`);
  return response;
};

export const getItinerary = async (id: string) => {
  const response = await axios.get(`${API_URL}/itineraries/${id}`);
  return response;
};

export const createItinerary = async (itinerary: Omit<Itinerary, 'id'>) => {
  const response = await axios.post(`${API_URL}/itineraries`, itinerary);
  return response;
};

export const updateItinerary = async (id: string, data: Partial<Itinerary>) => {
  const response = await axios.put(`${API_URL}/itineraries/${id}`, data);
  return response;
};

export const deleteItinerary = async (id: string) => {
  const response = await axios.delete(`${API_URL}/itineraries/${id}`);
  return response;
};


export const getItineraryBudget = async (id: string) => {
  const response = await axios.get(`${API_URL}/itineraries/${id}/budget`);
  return response;
};


export const getMockDestinations = () => {

  return getDestinations();
};

export const getMockItineraries = () => {

  return getItineraries();
}; 