import { request } from 'umi';
import { BieuMau } from '@/models/sovanbangtypes';

const BASE_URL = 'https://67e4bdd52ae442db76d5652c.mockapi.io/api/degrees';

export async function getFormFields(): Promise<BieuMau.FormField[]> {
  try {
    return await request(`${BASE_URL}/formfields`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching form fields:', error);
    throw error;
  }
}

export async function getFormFieldById(id: string): Promise<BieuMau.FormField> {
  try {
    return await request(`${BASE_URL}/formfields/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching form field with id ${id}:`, error);
    throw error;
  }
}

export async function createFormField(data: BieuMau.FormField): Promise<BieuMau.FormField> {
  try {
    return await request(`${BASE_URL}/formfields`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating form field:', error);
    throw error;
  }
}

export async function updateFormField(data: BieuMau.FormField): Promise<BieuMau.FormField> {
  try {
    return await request(`${BASE_URL}/formfields/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating form field:', error);
    throw error;
  }
}

export async function deleteFormField(id: string): Promise<void> {
  try {
    return await request(`${BASE_URL}/formfields/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting form field:', error);
    throw error;
  }
}

export async function updateFieldOrder(fields: BieuMau.FormField[]): Promise<BieuMau.FormField[]> {
  try {
    // Thực tế, API này có thể cần phải thay đổi tùy theo backend
    return await request(`${BASE_URL}/formfields/updateOrder`, {
      method: 'PUT',
      data: fields,
    });
  } catch (error) {
    console.error('Error updating field order:', error);
    throw error;
  }
} 