import { request } from 'umi';
import { QuyetDinh } from '@/models/sovanbangtypes';

const BASE_URL = 'https://67e4bdd52ae442db76d5652c.mockapi.io/api/degrees';

export async function getGraduationDecisions(): Promise<QuyetDinh.GraduationDecision[]> {
  try {
    return await request(`${BASE_URL}/graduationDecisions`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching graduation decisions:', error);
    throw error;
  }
}

export async function getGraduationDecisionById(id: string): Promise<QuyetDinh.GraduationDecision> {
  try {
    return await request(`${BASE_URL}/graduationDecisions/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching graduation decision with id ${id}:`, error);
    throw error;
  }
}

export async function createGraduationDecision(data: QuyetDinh.GraduationDecision): Promise<QuyetDinh.GraduationDecision> {
  try {
    return await request(`${BASE_URL}/graduationDecisions`, {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.error('Error creating graduation decision:', error);
    throw error;
  }
}

export async function updateGraduationDecision(data: QuyetDinh.GraduationDecision): Promise<QuyetDinh.GraduationDecision> {
  if (!data.id) {
    throw new Error('Graduation decision ID is required for updates');
  }
  
  try {
    return await request(`${BASE_URL}/graduationDecisions/${data.id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.error('Error updating graduation decision:', error);
    throw error;
  }
}

export async function deleteGraduationDecision(id: string): Promise<void> {
  try {
    return await request(`${BASE_URL}/graduationDecisions/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting graduation decision:', error);
    throw error;
  }
}

export async function incrementLookupCount(id: string): Promise<QuyetDinh.GraduationDecision> {
  try {
    const decision = await getGraduationDecisionById(id);
    if (!decision) {
      throw new Error(`Graduation decision with id ${id} not found`);
    }
    
    const updatedDecision = {
      ...decision,
      totalLookups: (decision.totalLookups || 0) + 1,
    };
    
    return await updateGraduationDecision(updatedDecision);
  } catch (error) {
    console.error(`Error incrementing lookup count for decision ${id}:`, error);
    throw error;
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