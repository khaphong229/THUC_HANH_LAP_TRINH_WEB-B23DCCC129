import { request } from 'umi';
import { BieuMau } from '@/models/sovanbangtypes';

const BASE_URL = 'https://67e4bdd52ae442db76d5652c.mockapi.io/api/degrees';

async function checkApiConnection(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
}

export async function getCertificateTemplateFields(): Promise<BieuMau.CertificateTemplateField[]> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/templateFields`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return [
        { 
          id: 'field1', 
          name: 'Họ và tên', 
          dataType: 'String',
          inputControl: 'text'
        },
        { 
          id: 'field2', 
          name: 'Ngày sinh', 
          dataType: 'Date',
          inputControl: 'date' 
        },
        { 
          id: 'field3', 
          name: 'Xếp loại', 
          dataType: 'String',
          inputControl: 'select' 
        }
      ];
    }
    
    return await request(`${BASE_URL}/templateFields`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching certificate template fields:', error);
    return [
      { 
        id: 'field1', 
        name: 'Họ và tên', 
        dataType: 'String',
        inputControl: 'text'
      },
      { 
        id: 'field2', 
        name: 'Ngày sinh', 
        dataType: 'Date',
        inputControl: 'date' 
      },
      { 
        id: 'field3', 
        name: 'Xếp loại', 
        dataType: 'String',
        inputControl: 'select' 
      }
    ];
  }
}

export async function getCertificateTemplateFieldById(id: string): Promise<BieuMau.CertificateTemplateField> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/templateFields/${id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return { 
        id, 
        name: 'Trường mẫu', 
        dataType: 'String',
        inputControl: 'text'
      };
    }
    
    return await request(`${BASE_URL}/templateFields/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching certificate template field with id ${id}:`, error);
    return { 
      id, 
      name: 'Trường mẫu', 
      dataType: 'String',
      inputControl: 'text'
    };
  }
}

export async function createCertificateTemplateField(data: BieuMau.CertificateTemplateField): Promise<BieuMau.CertificateTemplateField> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/templateFields`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return { ...data, id: 'mock-' + Date.now() };
    }
    
    return await request(`${BASE_URL}/templateFields`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating certificate template field:', error);
    return { ...data, id: 'mock-' + Date.now() };
  }
}

export async function updateCertificateTemplateField(data: BieuMau.CertificateTemplateField): Promise<BieuMau.CertificateTemplateField> {
  if (!data.id) {
    throw new Error('Certificate template field ID is required for updates');
  }
  
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/templateFields/${data.id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return data;
    }
    
    return await request(`${BASE_URL}/templateFields/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating certificate template field:', error);
    return data;
  }
}

export async function deleteCertificateTemplateField(id: string): Promise<void> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/templateFields/${id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, operation would fail in production');
      return;
    }
    
    return await request(`${BASE_URL}/templateFields/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting certificate template field:', error);
  }
} 