import { MBTIType, Career } from '../types/mbti';
import { careers } from '../data/careers';

export function getCareerRecommendations(type: MBTIType): Career[] {
  // 首先筛选出适合该MBTI类型的职业
  const suitableCareers = careers.filter(career => 
    career.suitableTypes.includes(type)
  );
  
  // 如果没有直接匹配的职业，返回所有职业（作为备选）
  if (suitableCareers.length === 0) {
    return careers;
  }
  
  // 按照适合度排序（这里简单按照匹配的MBTI类型数量排序）
  const sortedCareers = suitableCareers.sort((a, b) => {
    // 计算每个职业适合的MBTI类型数量
    const aScore = a.suitableTypes.length;
    const bScore = b.suitableTypes.length;
    return bScore - aScore; // 降序排列
  });
  
  return sortedCareers;
}

export function getCareerDetails(careerId: number): Career | undefined {
  return careers.find(career => career.id === careerId);
}
