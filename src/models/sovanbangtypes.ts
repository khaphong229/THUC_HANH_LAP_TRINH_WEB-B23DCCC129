import { useCallback, useState } from 'react';
import { getGraduationBooks, createGraduationBook, updateGraduationBook, getCertificates, createCertificate, updateCertificate, deleteCertificate } from '@/services/VanBang';
import { getGraduationDecisions, createGraduationDecision, updateGraduationDecision, deleteGraduationDecision } from '@/services/QuyetDinh';
import { getCertificateTemplateFields, createCertificateTemplateField, updateCertificateTemplateField, deleteCertificateTemplateField } from '@/services/BieuMau';
import { searchCertificates } from '@/services/TraCuu';

export namespace VanBang {
  export interface GraduationBook {
    id?: string;
    year: number;
    currentSequenceNumber: number;
  }

  export interface Certificate {
    id?: string;
    graduationBookId: string;
    sequenceNumber: number;
    certificateNumber: string;
    studentId: string;
    fullName: string;
    dateOfBirth: string;
    graduationDecisionId: string;
    additionalFields?: Record<string, any>;
  }
}

export namespace BieuMau {
  export interface CertificateTemplateField {
    id?: string;
    name: string;
    dataType: 'String' | 'Number' | 'Date';
    inputControl: string;
  }
}

export namespace QuyetDinh {
  export interface GraduationDecision {
    id?: string;
    decisionNumber: string;
    issuedDate: string;
    summary: string;
    graduationBook: string;
    totalLookups?: number;
  }
}

export namespace TraCuu {
  export interface SearchParams {
    keyword?: string;
    studentId?: string;
    fullName?: string;
    certificateNumber?: string;
    decisionNumber?: string;
    graduationYear?: number;
  }

  export interface SearchResult extends VanBang.Certificate {
    decisionNumber: string;
    issuedDate: string;
    graduationYear: number;
  }
}

export default () => {
  const [graduationBooks, setGraduationBooks] = useState<VanBang.GraduationBook[]>([]);
  const [activeGraduationBook, setActiveGraduationBook] = useState<VanBang.GraduationBook | null>(null);
  const [certificates, setCertificates] = useState<VanBang.Certificate[]>([]);
  const [graduationDecisions, setGraduationDecisions] = useState<QuyetDinh.GraduationDecision[]>([]);
  const [templateFields, setTemplateFields] = useState<BieuMau.CertificateTemplateField[]>([]);
  const [searchResults, setSearchResults] = useState<TraCuu.SearchResult[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      try {
        const booksResponse = await getGraduationBooks();
        setGraduationBooks(booksResponse);
        
        if (booksResponse.length > 0) {
          const newestBook = booksResponse.reduce((newest, current) => 
            current.year > newest.year ? current : newest, booksResponse[0]);
          setActiveGraduationBook(newestBook);
        }
      } catch (error) {
        console.error('Error fetching graduation books:', error);
      }
      
      try {
        const certificatesResponse = await getCertificates();
        setCertificates(certificatesResponse);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
      
      try {
        const decisionsResponse = await getGraduationDecisions();
        setGraduationDecisions(decisionsResponse);
      } catch (error) {
        console.error('Error fetching graduation decisions:', error);
      }
      
      try {
        const fieldsResponse = await getCertificateTemplateFields();
        setTemplateFields(fieldsResponse);
      } catch (error) {
        console.error('Error fetching certificate template fields:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addGraduationBook = useCallback(async (book: VanBang.GraduationBook) => {
    try {
      const response = await createGraduationBook(book);
      setGraduationBooks(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error adding graduation book:', error);
      throw error;
    }
  }, []);

  const updateGraduationBookHandler = useCallback(async (book: VanBang.GraduationBook) => {
    try {
      const response = await updateGraduationBook(book);
      setGraduationBooks(prev => prev.map(item => (item.id === book.id ? response : item)));
      
      if (activeGraduationBook?.id === book.id) {
        setActiveGraduationBook(response);
      }
      
      return response;
    } catch (error) {
      console.error('Error updating graduation book:', error);
      throw error;
    }
  }, [activeGraduationBook]);

  const addCertificate = useCallback(async (certificate: VanBang.Certificate) => {
    try {
      const response = await createCertificate(certificate);
      setCertificates(prev => [...prev, response]);
      
      if (activeGraduationBook?.id === certificate.graduationBookId) {
        setActiveGraduationBook(prev => prev ? {
          ...prev,
          currentSequenceNumber: Math.max(prev.currentSequenceNumber, certificate.sequenceNumber + 1)
        } : prev);
      }
      
      return response;
    } catch (error) {
      console.error('Error adding certificate:', error);
      throw error;
    }
  }, [activeGraduationBook]);

  const updateCertificateHandler = useCallback(async (certificate: VanBang.Certificate) => {
    try {
      const response = await updateCertificate(certificate);
      setCertificates(prev => prev.map(item => (item.id === certificate.id ? response : item)));
      return response;
    } catch (error) {
      console.error('Error updating certificate:', error);
      throw error;
    }
  }, []);

  const deleteCertificateHandler = useCallback(async (id: string) => {
    try {
      await deleteCertificate(id);
      setCertificates(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
      throw error;
    }
  }, []);

  const addGraduationDecision = useCallback(async (decision: QuyetDinh.GraduationDecision) => {
    try {
      const response = await createGraduationDecision(decision);
      setGraduationDecisions(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error adding graduation decision:', error);
      throw error;
    }
  }, []);

  const updateGraduationDecisionHandler = useCallback(async (decision: QuyetDinh.GraduationDecision) => {
    try {
      const response = await updateGraduationDecision(decision);
      setGraduationDecisions(prev => prev.map(item => (item.id === decision.id ? response : item)));
      return response;
    } catch (error) {
      console.error('Error updating graduation decision:', error);
      throw error;
    }
  }, []);

  const deleteGraduationDecisionHandler = useCallback(async (id: string) => {
    try {
      await deleteGraduationDecision(id);
      setGraduationDecisions(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting graduation decision:', error);
      throw error;
    }
  }, []);

  const addTemplateField = useCallback(async (field: BieuMau.CertificateTemplateField) => {
    try {
      const response = await createCertificateTemplateField(field);
      setTemplateFields(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error adding template field:', error);
      throw error;
    }
  }, []);

  const updateTemplateFieldHandler = useCallback(async (field: BieuMau.CertificateTemplateField) => {
    try {
      const response = await updateCertificateTemplateField(field);
      setTemplateFields(prev => prev.map(item => (item.id === field.id ? response : item)));
      return response;
    } catch (error) {
      console.error('Error updating template field:', error);
      throw error;
    }
  }, []);

  const deleteTemplateFieldHandler = useCallback(async (id: string) => {
    try {
      await deleteCertificateTemplateField(id);
      setTemplateFields(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting template field:', error);
      throw error;
    }
  }, []);

  const searchCertificatesHandler = useCallback(async (params: TraCuu.SearchParams) => {
    try {
      const results = await searchCertificates(params);
      setSearchResults(results);
      setSearchPerformed(true);
      return results;
    } catch (error) {
      console.error('Error searching certificates:', error);
      throw error;
    }
  }, []);

  return {
    graduationBooks,
    activeGraduationBook,
    certificates,
    graduationDecisions,
    templateFields,
    searchResults,
    searchPerformed,
    isLoading,
    
    fetchInitialData,
    addGraduationBook,
    updateGraduationBook: updateGraduationBookHandler,
    addCertificate,
    updateCertificate: updateCertificateHandler,
    deleteCertificate: deleteCertificateHandler,
    addGraduationDecision,
    updateGraduationDecision: updateGraduationDecisionHandler,
    deleteGraduationDecision: deleteGraduationDecisionHandler,
    addTemplateField,
    updateTemplateField: updateTemplateFieldHandler,
    deleteTemplateField: deleteTemplateFieldHandler,
    searchCertificates: searchCertificatesHandler,
  };
};