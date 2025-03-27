import { request } from 'umi';
import { VanBang } from '@/models/sovanbangtypes';

// API Types
export interface DegreeBook {
  id?: string;
  year: number;
  description: string;
  currentNumber: number;
  openDate: string;
  closeDate?: string;
  status?: 'active' | 'closed';
}

export interface DegreeInfo {
  id?: string;
  bookNumber: number;
  degreeCode: string;
  studentId: string;
  fullName: string;
  birthDate: string;
  decisionId: string;
  degreeBookId: string;
  formFeildId?: string; // Note: typo in API
  created_at?: string;
  customFields?: Record<string, any>;
}

const BASE_URL = 'https://67e4bdd52ae442db76d5652c.mockapi.io/api/degrees';
const CERTIFICATES_URL = 'https://67e535d218194932a5851205.mockapi.io/api/vanbang';

// GraduationBook API services
export async function getGraduationBooks(): Promise<VanBang.GraduationBook[]> {
  try {
    return await request(`${BASE_URL}/graduationBooks`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching graduation books:', error);
    throw error;
  }
}

export async function getGraduationBookById(id: string): Promise<VanBang.GraduationBook> {
  try {
    return await request(`${BASE_URL}/graduationBooks/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching graduation book with id ${id}:`, error);
    throw error;
  }
}

export async function createGraduationBook(data: VanBang.GraduationBook): Promise<VanBang.GraduationBook> {
  try {
    return await request(`${BASE_URL}/graduationBooks`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating graduation book:', error);
    throw error;
  }
}

export async function updateGraduationBook(data: VanBang.GraduationBook): Promise<VanBang.GraduationBook> {
  if (!data.id) {
    throw new Error('Graduation book ID is required for updates');
  }
  
  try {
    return await request(`${BASE_URL}/graduationBooks/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating graduation book:', error);
    throw error;
  }
}

// Certificate API services
export async function getCertificates(): Promise<VanBang.Certificate[]> {
  try {
    return await request(`${CERTIFICATES_URL}/certificates`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
}

export async function getCertificateById(id: string): Promise<VanBang.Certificate> {
  try {
    return await request(`${CERTIFICATES_URL}/certificates/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching certificate with id ${id}:`, error);
    throw error;
  }
}

export async function createCertificate(data: VanBang.Certificate): Promise<VanBang.Certificate> {
  try {
    return await request(`${CERTIFICATES_URL}/certificates`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw error;
  }
}

export async function updateCertificate(data: VanBang.Certificate): Promise<VanBang.Certificate> {
  if (!data.id) {
    throw new Error('Certificate ID is required for updates');
  }
  
  try {
    return await request(`${CERTIFICATES_URL}/certificates/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating certificate:', error);
    throw error;
  }
}

export async function deleteCertificate(id: string): Promise<void> {
  try {
    return await request(`${CERTIFICATES_URL}/certificates/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
}

// DegreeBook API services
export async function getDegreeBooks(): Promise<VanBang.DegreeBook[]> {
  try {
    return await request(`${BASE_URL}/sovanbang`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching degree books:', error);
    throw error;
  }
}

export async function getDegreeBookById(id: string): Promise<VanBang.DegreeBook> {
  try {
    return await request(`${BASE_URL}/sovanbang/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching degree book with id ${id}:`, error);
    throw error;
  }
}

export async function createDegreeBook(data: VanBang.DegreeBook): Promise<VanBang.DegreeBook> {
  try {
    return await request(`${BASE_URL}/sovanbang`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating degree book:', error);
    throw error;
  }
}

export async function updateDegreeBook(data: VanBang.DegreeBook): Promise<VanBang.DegreeBook> {
  if (!data.id) {
    throw new Error('Degree book ID is required for updates');
  }
  
  try {
    return await request(`${BASE_URL}/sovanbang/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating degree book:', error);
    throw error;
  }
}

export async function closeDegreeBook(id: string, closeDate: string): Promise<VanBang.DegreeBook> {
  try {
    const book = await getDegreeBookById(id);
    if (!book) {
      throw new Error(`Degree book with id ${id} not found`);
    }
    
    const updatedBook = {
      ...book,
      status: 'closed' as const,
      closeDate,
    };
    
    return await updateDegreeBook(updatedBook);
  } catch (error) {
    console.error(`Error closing degree book ${id}:`, error);
    throw error;
  }
}

// DegreeInfo API services
export async function getDegreeInfos(): Promise<VanBang.DegreeInfo[]> {
  try {
    return await request(`${BASE_URL}/degreeinfor`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching degree infos:', error);
    throw error;
  }
}

export async function getDegreeInfoById(id: string): Promise<VanBang.DegreeInfo> {
  try {
    return await request(`${BASE_URL}/degreeinfor/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching degree info with id ${id}:`, error);
    throw error;
  }
}

export async function createDegreeInfo(data: VanBang.DegreeInfo): Promise<VanBang.DegreeInfo> {
  try {
    return await request(`${BASE_URL}/degreeinfor`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating degree info:', error);
    throw error;
  }
}

export async function updateDegreeInfo(data: VanBang.DegreeInfo): Promise<VanBang.DegreeInfo> {
  if (!data.id) {
    throw new Error('Degree info ID is required for updates');
  }
  
  try {
    return await request(`${BASE_URL}/degreeinfor/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating degree info:', error);
    throw error;
  }
}

export async function deleteDegreeInfo(id: string): Promise<void> {
  try {
    return await request(`${BASE_URL}/degreeinfor/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting degree info:', error);
    throw error;
  }
} 