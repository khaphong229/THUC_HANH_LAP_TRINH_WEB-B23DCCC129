import { request } from 'umi';
import { QuyetDinh } from '@/models/sovanbangtypes';

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

export async function getGraduationDecisions(): Promise<QuyetDinh.GraduationDecision[]> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return [
        { 
          id: 'mock1', 
          decisionNumber: 'QD-001/2023', 
          issuedDate: '2023-06-15', 
          summary: 'Quyết định tốt nghiệp đợt 1 năm 2023', 
          graduationBook: 'book1',
          totalLookups: 0
        },
        { 
          id: 'mock2', 
          decisionNumber: 'QD-002/2023', 
          issuedDate: '2023-12-15', 
          summary: 'Quyết định tốt nghiệp đợt 2 năm 2023', 
          graduationBook: 'book1',
          totalLookups: 0
        }
      ];
    }
    
    return await request(`${BASE_URL}/decisions`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching graduation decisions:', error);
    return [
      { 
        id: 'mock1', 
        decisionNumber: 'QD-001/2023', 
        issuedDate: '2023-06-15', 
        summary: 'Quyết định tốt nghiệp đợt 1 năm 2023', 
        graduationBook: 'book1',
        totalLookups: 0
      },
      { 
        id: 'mock2', 
        decisionNumber: 'QD-002/2023', 
        issuedDate: '2023-12-15', 
        summary: 'Quyết định tốt nghiệp đợt 2 năm 2023', 
        graduationBook: 'book1',
        totalLookups: 0
      }
    ];
  }
}

export async function getGraduationDecisionById(id: string): Promise<QuyetDinh.GraduationDecision> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions/${id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return { 
        id, 
        decisionNumber: 'QD-001/2023', 
        issuedDate: '2023-06-15', 
        summary: 'Quyết định tốt nghiệp đợt 1 năm 2023', 
        graduationBook: 'book1',
        totalLookups: 0
      };
    }
    
    return await request(`${BASE_URL}/decisions/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching graduation decision with id ${id}:`, error);
    return { 
      id, 
      decisionNumber: 'QD-001/2023', 
      issuedDate: '2023-06-15', 
      summary: 'Quyết định tốt nghiệp đợt 1 năm 2023', 
      graduationBook: 'book1',
      totalLookups: 0
    };
  }
}

export async function createGraduationDecision(data: QuyetDinh.GraduationDecision): Promise<QuyetDinh.GraduationDecision> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return { ...data, id: 'mock-' + Date.now() };
    }
    
    return await request(`${BASE_URL}/decisions`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating graduation decision:', error);
    return { ...data, id: 'mock-' + Date.now() };
  }
}

export async function updateGraduationDecision(data: QuyetDinh.GraduationDecision): Promise<QuyetDinh.GraduationDecision> {
  if (!data.id) {
    throw new Error('Graduation decision ID is required for updates');
  }
  
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions/${data.id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return data;
    }
    
    return await request(`${BASE_URL}/decisions/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating graduation decision:', error);
    return data;
  }
}

export async function deleteGraduationDecision(id: string): Promise<void> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions/${id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, operation would fail in production');
      return;
    }
    
    return await request(`${BASE_URL}/decisions/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting graduation decision:', error);
  }
}

export async function incrementLookupCount(id: string): Promise<QuyetDinh.GraduationDecision> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions/${id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, operation would fail in production');
      return { 
        id, 
        decisionNumber: 'QD-001/2023', 
        issuedDate: '2023-06-15', 
        summary: 'Quyết định tốt nghiệp đợt 1 năm 2023', 
        graduationBook: 'book1',
        totalLookups: 1 // Giả lập tăng lượt truy cập
      };
    }
    
    const decision = await getGraduationDecisionById(id);
    
    const updatedDecision = {
      ...decision,
      totalLookups: (decision.totalLookups || 0) + 1,
    };
    
    return await updateGraduationDecision(updatedDecision);
  } catch (error) {
    console.error(`Error incrementing lookup count for decision ${id}:`, error);
    return { 
      id, 
      decisionNumber: 'QD-001/2023', 
      issuedDate: '2023-06-15', 
      summary: 'Quyết định tốt nghiệp đợt 1 năm 2023', 
      graduationBook: 'book1',
      totalLookups: 1 // Giả lập tăng lượt truy cập
    };
  }
}

export async function getDecisionsByDegreeBookId(degreeBookId: string) {
  try {
    return await request(`${BASE_URL}/decisions?degreeBookId=${degreeBookId}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching decisions for degree book ${degreeBookId}:`, error);
    throw error;
  }
} 