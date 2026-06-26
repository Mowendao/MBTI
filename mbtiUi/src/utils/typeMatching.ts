import type { MBTIType } from '@/types/mbti';

/** 获取一个类型的四维二进制表示 */
function getDims(type: MBTIType): number[] {
  const map: Record<string, number> = { E: 1, I: 0, S: 1, N: 0, T: 1, F: 0, J: 1, P: 0 };
  return [map[type[0]], map[type[1]], map[type[2]], map[type[3]]];
}

/** 获取维度名称 */
function getDimNames(type: MBTIType): string[] {
  return [type[0], type[1], type[2], type[3]];
}

export interface MatchResult {
  overall: number;
  friendship: number;
  romance: number;
  work: number;
  communication: number;
  sameDims: number;
  diffDims: string[];
}

/**
 * MBTI 类型匹配度计算算法
 *
 * 核心逻辑：
 * - 四维中每相同一个维度 +25 基础分
 * - E/I 维度：决定社交能量匹配，对友谊/恋爱影响大
 * - S/N 维度：决定认知方式匹配，对沟通影响大
 * - T/F 维度：决定决策方式匹配，对工作影响大
 * - J/P 维度：决定生活方式匹配，对所有关系都有影响
 */
export function calculateMatch(typeA: MBTIType, typeB: MBTIType): MatchResult {
  const a = getDims(typeA);
  const b = getDims(typeB);
  const namesA = getDimNames(typeA);
  const namesB = getDimNames(typeB);

  // 每维是否相同
  const same = a.map((v, i) => v === b[i]);
  const sameCount = same.filter(Boolean).length;

  // 找出不同的维度
  const diffDims: string[] = [];
  const dimLabels = ['精力来源', '认知方式', '决策方式', '生活方式'];
  same.forEach((isSame, i) => {
    if (!isSame) diffDims.push(dimLabels[i] + ` (${namesA[i]} vs ${namesB[i]})`);
  });

  // 基础分 + 总分
  const base = sameCount * 25;
  const overall = Math.min(100, Math.max(0, base + (sameCount >= 3 ? 10 : sameCount <= 1 ? -5 : 0)));

  // 分项得分
  const friendship = Math.min(100, Math.max(0,
    (same[0] ? 40 : 15) + (same[1] ? 25 : 10) + (same[2] ? 20 : 10) + (same[3] ? 15 : 5)
  ));

  const romance = Math.min(100, Math.max(0,
    (same[0] ? 30 : 20) + (same[1] ? 25 : 10) + (same[2] ? 25 : 10) + (same[3] ? 20 : 10)
  ));

  const work = Math.min(100, Math.max(0,
    (same[0] ? 20 : 5) + (same[1] ? 20 : 10) + (same[2] ? 30 : 15) + (same[3] ? 30 : 10)
  ));

  const communication = Math.min(100, Math.max(0,
    (same[0] ? 25 : 10) + (same[1] ? 30 : 15) + (same[2] ? 25 : 10) + (same[3] ? 20 : 10)
  ));

  return {
    overall,
    friendship,
    romance,
    work,
    communication,
    sameDims: sameCount,
    diffDims,
  };
}

/** 获取相处建议 */
export function getAdvice(typeA: MBTIType, typeB: MBTIType, match: MatchResult): string[] {
  const advice: string[] = [];

  if (match.sameDims >= 3) {
    advice.push('你们非常相似！在很多方面都能自然而然地理解对方。注意不要陷入"回音室效应"，多倾听不同意见。');
  } else if (match.sameDims <= 1) {
    advice.push('你们是完全不同的类型，这正是魅力的来源！互补可以让你们看到更广阔的世界，但也需要更多的理解和包容。');
  } else {
    advice.push('你们有相似之处也有不同之处，这是最健康的组合。既能互相理解，又能互补成长。');
  }

  // 基于维度差异给具体建议
  if (typeA[0] !== typeB[0]) {
    const eType = typeA[0] === 'E' ? typeA : typeB;
    const iType = typeA[0] === 'I' ? typeA : typeB;
    advice.push(`作为外向的 ${eType} 和内向的 ${iType}，${eType} 需要理解和尊重 ${iType} 需要独处充电的需求，${iType} 也可以尝试参与 ${eType} 的社交活动。`);
  }

  if (typeA[1] !== typeB[1]) {
    advice.push('在认知方式上一个偏感觉一个偏直觉，沟通时要注意：感觉型多给具体案例，直觉型多讲宏观图景。');
  }

  if (typeA[2] !== typeB[2]) {
    advice.push('决策方式不同：一个偏理性分析，一个偏情感考量。讨论问题时需要兼顾逻辑和感受两方面。');
  }

  if (typeA[3] !== typeB[3]) {
    advice.push('生活方式一个偏计划一个偏灵活，建议在共同事务上提前约定规则，在生活中给对方留出弹性空间。');
  }

  return advice;
}
