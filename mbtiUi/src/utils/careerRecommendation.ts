import { MBTIType, Career } from '@/types/mbti';
import { careers } from '@/data/careers';

export function getCareerRecommendations(type: MBTIType): Career[] {
  // 筛选出适合该MBTI类型的职业
  const suitableCareers = careers.filter(career =>
    career.suitableTypes.includes(type)
  );

  // 如果没有直接匹配的职业，返回所有职业（作为备选）
  if (suitableCareers.length === 0) {
    return careers;
  }

  return suitableCareers;
}

export function getCareerDetails(careerId: number): Career | undefined {
  return careers.find(career => career.id === careerId);
}
