// src/services/api.ts
import axios from 'axios';
import { Club, ClubFormValues, ClubTableParams } from '../../../models/club';
import { Member, MemberTableParams } from '../../../models/member';

const API_BASE_URL = 'https://67f729c442d6c71cca6435b5.mockapi.io/api';

// Hàm chuyển đổi file thành Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Club API
export const getClubs = async (params: ClubTableParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clb/cubs`, {
      params: {
        page: params.pagination.current,
        limit: params.pagination.pageSize,
        sortBy: params.sorter?.field,
        order: params.sorter?.order,
        search: params.search,
        ...params.filters,
      },
    });
    
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count'] || '0', 10) || response.data.length,
    };
  } catch (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }
};

export const getClubById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clb/cubs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching club with id ${id}:`, error);
    throw error;
  }
};

export const createClub = async (club: ClubFormValues) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/clb/cubs`, club);
    return response.data;
  } catch (error) {
    console.error('Error creating club:', error);
    throw error;
  }
};

export const updateClub = async (id: number, club: ClubFormValues) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/clb/cubs/${id}`, club);
    return response.data;
  } catch (error) {
    console.error(`Error updating club with id ${id}:`, error);
    throw error;
  }
};

export const deleteClub = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/clb/cubs/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting club with id ${id}:`, error);
    throw error;
  }
};

// Upload API
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Trong tình huống thực tế, bạn sẽ upload file lên server
    // Nhưng ở đây chúng ta sẽ convert file thành base64 và trả về
    const base64 = await fileToBase64(file);
    
    // Giả lập quá trình tải lên server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(base64);
      }, 1000);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Member API
export const getClubMembers = async (params: MemberTableParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clb/cubs/${params.clubId}/members`, {
      params: {
        page: params.pagination.current,
        limit: params.pagination.pageSize,
        sortBy: params.sorter?.field,
        order: params.sorter?.order,
        search: params.search,
        ...params.filters,
      },
    });
    
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count'] || '0', 10) || response.data.length,
    };
  } catch (error) {
    console.error(`Error fetching members for club ${params.clubId}:`, error);
    // Giả sử API có thể không tồn tại, trả về mảng rỗng
    return {
      data: [] as Member[],
      total: 0
    };
  }
};