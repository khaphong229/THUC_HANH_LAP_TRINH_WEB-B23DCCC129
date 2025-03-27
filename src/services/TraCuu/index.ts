import { request } from 'umi';
import { TraCuu } from '@/models/sovanbangtypes';
import { incrementLookupCount } from '@/services/QuyetDinh';

// Cập nhật Base URL cho dịch vụ tra cứu
const BASE_URL = 'https://67e535d218194932a5851205.mockapi.io/api/vanbang';

export async function searchCertificates(params: TraCuu.SearchParams): Promise<TraCuu.SearchResult[]> {
  try {
    const { keyword, studentId, fullName, certificateNumber, decisionNumber, graduationYear } = params;
    
    // Construct query parameters - thay đổi để phù hợp với API mock
    let queryUrl = `${BASE_URL}/certificates`;
    
    // Gọi API certificates chung, rồi filter kết quả
    const response = await request(queryUrl, {
      method: 'GET',
    });
    
    // Filter kết quả theo tham số tìm kiếm
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
        // Lấy graduationDecisionId từ certificate
        // Để đơn giản, giả sử là ta map decisionNumber vào kết quả
        return true; // Mockup API không có trường này để filter
      });
    }
    
    if (graduationYear) {
      results = results.filter(item => {
        // Lấy năm từ graduationBookId 
        // Để đơn giản, giả sử là ta map graduationYear vào kết quả
        return true; // Mockup API không có trường này để filter
      });
    }
    
    // Map kết quả sang định dạng SearchResult
    const searchResults: TraCuu.SearchResult[] = results.map(cert => ({
      ...cert,
      decisionNumber: "MOCKAPI-DECISION", // Giả lập thêm các trường này
      issuedDate: new Date().toISOString().substring(0, 10),
      graduationYear: new Date().getFullYear()
    }));
    
    return searchResults;
  } catch (error) {
    console.error('Error searching certificates:', error);
    throw error;
  }
}

export async function getCertificateDetail(id: string): Promise<TraCuu.SearchResult> {
  try {
    const certificate = await request(`${BASE_URL}/certificates/${id}`, {
      method: 'GET',
    });
    
    // Tăng số lượt tra cứu cho quyết định liên quan
    if (certificate.graduationDecisionId) {
      try {
        await incrementLookupCount(certificate.graduationDecisionId);
      } catch (error) {
        console.error('Error incrementing lookup count:', error);
      }
    }
    
    // Map kết quả sang định dạng SearchResult
    return {
      ...certificate,
      decisionNumber: "MOCKAPI-DECISION", // Giả lập thêm các trường này
      issuedDate: new Date().toISOString().substring(0, 10),
      graduationYear: new Date().getFullYear()
    };
  } catch (error) {
    console.error(`Error fetching certificate detail with id ${id}:`, error);
    throw error;
  }
}

export async function validateCertificate(certificateNumber: string, studentId: string): Promise<boolean> {
  try {
    // Sử dụng API certificates chung, sau đó filter
    const certificates = await request(`${BASE_URL}/certificates`, {
      method: 'GET',
    });
    
    // Kiểm tra xem có certificate nào thỏa mãn điều kiện không
    const validCertificate = certificates.some(
      (cert: any) => cert.certificateNumber === certificateNumber && cert.studentId === studentId
    );
    
    return validCertificate;
  } catch (error) {
    console.error('Error validating certificate:', error);
    return false;
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