import { request } from 'umi';
import { TraCuu } from '@/models/sovanbangtypes';

const BASE_URL = 'https://67e4bdd52ae442db76d5652c.mockapi.io/api/degrees';

export async function searchDegrees(filter: TraCuu.SearchFilter) {
  try {
    // Convert filter to query params
    const params = new URLSearchParams();
    if (filter.degreeCode) params.append('degreeCode', filter.degreeCode);
    if (filter.bookNumber) params.append('bookNumber', filter.bookNumber.toString());
    if (filter.studentId) params.append('studentId', filter.studentId);
    if (filter.fullName) params.append('fullName', filter.fullName);
    if (filter.birthDate) params.append('birthDate', filter.birthDate);

    // Make API call
    return await request(`${BASE_URL}/degreeinfor?${params.toString()}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error searching degrees:', error);
    throw error;
  }
}

export async function recordSearch(decisionId: string) {
  try {
    // Get current decision
    const decision = await request(`${BASE_URL}/decisions/${decisionId}`, {
      method: 'GET',
    });
    
    // Increment search count
    const searchCount = (decision.searchCount || 0) + 1;
    
    // Update decision
    return await request(`${BASE_URL}/decisions/${decisionId}`, {
      method: 'PATCH',
      data: { searchCount },
    });
  } catch (error) {
    console.error('Error recording search:', error);
    // Don't throw here as this is a non-critical operation
    console.log('Continuing despite search recording error');
  }
} 