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
  testResults: TestResult[];
  createdAt: string;
}