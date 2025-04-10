import axios from 'axios';
import { Member, MemberTableParams } from '../../../models/member';

const API_BASE_URL = 'https://67f72c0242d6c71cca643d81.mockapi.io/api';

// Member API
export const getClubMembers = async (params: MemberTableParams) => {
  try {
    // Fetch all members from the new API endpoint
    const response = await axios.get(`${API_BASE_URL}/clb/members`);
    
    // Filter members by clubId
    const allMembers = response.data;
    const filteredMembers = allMembers.filter((member: Member) => 
      member.clubId === params.clubId
    );
    
    // Handle pagination manually
    const { current, pageSize } = params.pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
    
    // Handle sorting if required
    if (params.sorter?.field && params.sorter?.order) {
      const { field, order } = params.sorter;
      paginatedMembers.sort((a: any, b: any) => {
        if (order === 'ascend') {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }
    
    return {
      data: paginatedMembers,
      total: filteredMembers.length,
    };
  } catch (error) {
    console.error(`Error fetching members for club ${params.clubId}:`, error);
    return {
      data: [] as Member[],
      total: 0
    };
  }
};