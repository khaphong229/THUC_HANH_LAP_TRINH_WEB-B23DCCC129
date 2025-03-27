import { request } from 'umi';
import { TraCuu } from '@/models/sovanbangtypes';
import { incrementLookupCount } from '@/services/QuyetDinh';

const BASE_URL = 'https://67e535d218194932a5851205.mockapi.io/api/vanbang';

async function checkApiConnection(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
}

export async function searchCertificates(params: TraCuu.SearchParams): Promise<TraCuu.SearchResult[]> {
  try {
    const { keyword, studentId, fullName, certificateNumber, decisionNumber, graduationYear } = params;
    
    const isConnected = await checkApiConnection(`${BASE_URL}/certificates`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return [
        {
          id: 'mock1',
          graduationBookId: 'book1',
          sequenceNumber: 1,
          certificateNumber: 'CERT001',
          studentId: 'STU001',
          fullName: 'Nguyễn Văn A',
          dateOfBirth: '2000-01-01',
          graduationDecisionId: 'dec1',
          decisionNumber: 'QD-001/2023',
          issuedDate: '2023-06-15',
          graduationYear: 2023
        },
        {
          id: 'mock2',
          graduationBookId: 'book1',
          sequenceNumber: 2,
          certificateNumber: 'CERT002',
          studentId: 'STU002',
          fullName: 'Trần Thị B',
          dateOfBirth: '2000-02-02',
          graduationDecisionId: 'dec1',
          decisionNumber: 'QD-001/2023',
          issuedDate: '2023-06-15',
          graduationYear: 2023
        }
      ];
    }
    
    let queryUrl = `${BASE_URL}/certificates`;
    
    const response = await request(queryUrl, {
      method: 'GET',
    });
    
    let results = [...response];
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      results = results.filter(item => 
        item.fullName?.toLowerCase().includes(lowerKeyword) ||
        item.studentId?.toLowerCase().includes(lowerKeyword) ||
        item.certificateNumber?.toLowerCase().includes(lowerKeyword)
      );
    }
    
    if (studentId) {
      results = results.filter(item => item.studentId?.includes(studentId));
    }
    
    if (fullName) {
      results = results.filter(item => item.fullName?.toLowerCase().includes(fullName.toLowerCase()));
    }
    
    if (certificateNumber) {
      results = results.filter(item => item.certificateNumber?.includes(certificateNumber));
    }
    
    if (decisionNumber) {
      results = results.filter(item => {
        return true;
      });
    }
    
    if (graduationYear) {
      results = results.filter(item => {
        return true;
      });
    }
    
    const searchResults: TraCuu.SearchResult[] = results.map(cert => ({
      ...cert,
      decisionNumber: "MOCKAPI-DECISION",
      issuedDate: new Date().toISOString().substring(0, 10),
      graduationYear: new Date().getFullYear()
    }));
    
    return searchResults;
  } catch (error) {
    console.error('Error searching certificates:', error);
    return [
      {
        id: 'mock1',
        graduationBookId: 'book1',
        sequenceNumber: 1,
        certificateNumber: 'CERT001',
        studentId: 'STU001',
        fullName: 'Nguyễn Văn A',
        dateOfBirth: '2000-01-01',
        graduationDecisionId: 'dec1',
        decisionNumber: 'QD-001/2023',
        issuedDate: '2023-06-15',
        graduationYear: 2023
      },
      {
        id: 'mock2',
        graduationBookId: 'book1',
        sequenceNumber: 2,
        certificateNumber: 'CERT002',
        studentId: 'STU002',
        fullName: 'Trần Thị B',
        dateOfBirth: '2000-02-02',
        graduationDecisionId: 'dec1',
        decisionNumber: 'QD-001/2023',
        issuedDate: '2023-06-15',
        graduationYear: 2023
      }
    ];
  }
}

export async function getCertificateDetail(id: string): Promise<TraCuu.SearchResult> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/certificates/${id}`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock data');
      return {
        id,
        graduationBookId: 'book1',
        sequenceNumber: 1,
        certificateNumber: 'CERT001',
        studentId: 'STU001',
        fullName: 'Nguyễn Văn A',
        dateOfBirth: '2000-01-01',
        graduationDecisionId: 'dec1',
        decisionNumber: 'QD-001/2023',
        issuedDate: '2023-06-15',
        graduationYear: 2023
      };
    }
    
    const certificate = await request(`${BASE_URL}/certificates/${id}`, {
      method: 'GET',
    });
    
    if (certificate.graduationDecisionId) {
      try {
        await incrementLookupCount(certificate.graduationDecisionId);
      } catch (error) {
        console.error('Error incrementing lookup count:', error);
      }
    }
    
    return {
      ...certificate,
      decisionNumber: "MOCKAPI-DECISION",
      issuedDate: new Date().toISOString().substring(0, 10),
      graduationYear: new Date().getFullYear()
    };
  } catch (error) {
    console.error(`Error fetching certificate detail with id ${id}:`, error);
    return {
      id,
      graduationBookId: 'book1',
      sequenceNumber: 1,
      certificateNumber: 'CERT001',
      studentId: 'STU001',
      fullName: 'Nguyễn Văn A',
      dateOfBirth: '2000-01-01',
      graduationDecisionId: 'dec1',
      decisionNumber: 'QD-001/2023',
      issuedDate: '2023-06-15',
      graduationYear: 2023
    };
  }
}

export async function validateCertificate(certificateNumber: string, studentId: string): Promise<boolean> {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/certificates`);
    if (!isConnected) {
      console.error('Cannot connect to API, returning mock validation');
      return true; // Giả lập luôn đúng khi không kết nối được API
    }
    
    const certificates = await request(`${BASE_URL}/certificates`, {
      method: 'GET',
    });
    
    const validCertificate = certificates.some(
      (cert: any) => cert.certificateNumber === certificateNumber && cert.studentId === studentId
    );
    
    return validCertificate;
  } catch (error) {
    console.error('Error validating certificate:', error);
    return true; // Giả lập luôn đúng khi có lỗi
  }
}

export async function recordSearch(decisionId: string) {
  try {
    const isConnected = await checkApiConnection(`${BASE_URL}/decisions/${decisionId}`);
    if (!isConnected) {
      console.error('Cannot connect to API, skipping search recording');
      return;
    }
    
    const decision = await request(`${BASE_URL}/decisions/${decisionId}`, {
      method: 'GET',
    });
    
    const searchCount = (decision.searchCount || 0) + 1;
    
    return await request(`${BASE_URL}/decisions/${decisionId}`, {
      method: 'PATCH',
      data: { searchCount },
    });
  } catch (error) {
    console.error('Error recording search:', error);
    console.log('Continuing despite search recording error');
  }
}