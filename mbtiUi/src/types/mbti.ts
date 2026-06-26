// MBTI类型定义
export type MBTIDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type MBTIType = 
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export interface Question {
  id: number;
  text: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  options: {
    text: string;
    value: number; // 1-7，1代表完全同意第一个维度，7代表完全同意第二个维度
  }[];
}

export interface TestResult {
  type: MBTIType;
  date: string;
  scores: {
    EI: number; // 正数为E，负数为I
    SN: number; // 正数为S，负数为N
    TF: number; // 正数为T，负数为F
    JP: number; // 正数为J，负数为P
  };
  percentage: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}

export interface Career {
  id: number;
  name: string;
  description: string;
  suitableTypes: MBTIType[];
  skills: string[];
  education: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
  /** 管理后台专用字段，前端注册时不填写 */
  phone?: string;
  /** 管理后台专用字段，前端注册时不填写 */
  department?: string;
  /** 管理后台专用字段，前端注册时不填写 */
  position?: string;
  active?: boolean;
  testResults: TestResult[];
  createdAt: string;
}

// ===== 管理后台实体类型 =====

export interface PersonalityDimension {
  id: number;
  code: string;
  name: string;
  description: string;
  category: 'EI' | 'SN' | 'TF' | 'JP';
}

export interface AssessmentType {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface Batch {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

export interface TestSchedule {
  id: number;
  batchId: number;
  batchName: string;
  assessmentTypeId: number;
  assessmentTypeName: string;
  startTime: string;
  endTime: string;
  location: string;
  active: boolean;
  createdAt: string;
}

export interface TestTaker {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  batchId: number;
  batchName: string;
  createdAt: string;
}

export interface AdminTestResult {
  id: number;
  testTakerId: number;
  testTakerName: string;
  testScheduleId: number;
  testScheduleName: string;
  personalityType: MBTIType;
  scores: TestResult['scores'];
  percentage: TestResult['percentage'];
  analysis: string;
  careerRecommendation: string;
  completed: boolean;
  completedAt: string;
}