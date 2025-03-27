import { request } from 'umi';
import { BieuMau } from '@/models/sovanbangtypes';

const BASE_URL = 'https://67e535d218194932a5851205.mockapi.io/api/vanbang';

export async function getCertificateTemplateFields(): Promise<BieuMau.CertificateTemplateField[]> {
  try {
    return await request(`${BASE_URL}/certificateTemplateFields`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching certificate template fields:', error);
    throw error;
  }
}

export async function getCertificateTemplateFieldById(id: string): Promise<BieuMau.CertificateTemplateField> {
  try {
    return await request(`${BASE_URL}/certificateTemplateFields/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching certificate template field with id ${id}:`, error);
    throw error;
  }
}

export async function createCertificateTemplateField(data: BieuMau.CertificateTemplateField): Promise<BieuMau.CertificateTemplateField> {
  try {
    return await request(`${BASE_URL}/certificateTemplateFields`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating certificate template field:', error);
    throw error;
  }
}

export async function updateCertificateTemplateField(data: BieuMau.CertificateTemplateField): Promise<BieuMau.CertificateTemplateField> {
  try {
    return await request(`${BASE_URL}/certificateTemplateFields/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating certificate template field:', error);
    throw error;
  }
}

export async function deleteCertificateTemplateField(id: string): Promise<void> {
  try {
    return await request(`${BASE_URL}/certificateTemplateFields/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting certificate template field:', error);
    throw error;
  }
} 