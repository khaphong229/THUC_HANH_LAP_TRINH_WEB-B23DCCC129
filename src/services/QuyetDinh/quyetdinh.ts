import { request } from 'umi';
import { QuyetDinh } from '@/models/sovanbangtypes';

const BASE_URL = 'https://67e4bdd52ae442db76d5652c.mockapi.io/api/degrees';

export async function getGraduationDecisions() {
  try {
    return await request(`${BASE_URL}/decisions`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching graduation decisions:', error);
    throw error;
  }
}

export async function getGraduationDecisionById(id: string) {
  try {
    return await request(`${BASE_URL}/decisions/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching graduation decision with id ${id}:`, error);
    throw error;
  }
}

export async function createGraduationDecision(decision: QuyetDinh.GraduationDecision) {
  try {
    return await request(`${BASE_URL}/decisions`, {
      method: 'POST',
      data: decision,
    });
  } catch (error) {
    console.error('Error creating graduation decision:', error);
    throw error;
  }
}

export async function updateGraduationDecision(decision: QuyetDinh.GraduationDecision) {
  if (!decision.id) {
    throw new Error('Decision ID is required for updates');
  }
  
  try {
    return await request(`${BASE_URL}/decisions/${decision.id}`, {
      method: 'PUT',
      data: decision,
    });
  } catch (error) {
    console.error(`Error updating graduation decision with id ${decision.id}:`, error);
    throw error;
  }
}

export async function deleteGraduationDecision(id: string) {
  try {
    return await request(`${BASE_URL}/decisions/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting graduation decision with id ${id}:`, error);
    throw error;
  }
}

export async function incrementSearchCount(id: string) {
  try {
    // Get current decision
    const decision = await getGraduationDecisionById(id);
    
    // Increment search count
    const updatedDecision = {
      ...decision,
      searchCount: (decision.searchCount || 0) + 1,
    };
    
    // Update decision
    return await updateGraduationDecision(updatedDecision);
  } catch (error) {
    console.error(`Error incrementing search count for decision ${id}:`, error);
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