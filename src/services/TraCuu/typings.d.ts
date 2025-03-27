declare namespace TraCuu {
  export interface SearchFilter {
    degreeCode?: string;
    bookNumber?: number;
    studentId?: string;
    fullName?: string;
    birthDate?: string;
  }
  
  export interface SearchResult {
    degree: VanBang.DegreeInfo;
    decision: QuyetDinh.GraduationDecision;
  }
} 