import { MBTIType, TestResult } from '../types/mbti';

export function calculateMBTI(scores: Record<string, number>): TestResult {
  // 计算每个维度的得分
  const eiScore = scores['EI'] || 0;
  const snScore = scores['SN'] || 0;
  const tfScore = scores['TF'] || 0;
  const jpScore = scores['JP'] || 0;

  // 确定每个维度的类型
  const e = eiScore > 0 ? 'E' : 'I';
  const s = snScore > 0 ? 'S' : 'N';
  const t = tfScore > 0 ? 'T' : 'F';
  const j = jpScore > 0 ? 'J' : 'P';

  // 组合成MBTI类型
  const type = `${e}${s}${t}${j}` as MBTIType;

  // 计算百分比
  const calculatePercentage = (score: number): number => {
    const absoluteScore = Math.abs(score);
    return Math.min(100, Math.round((absoluteScore / 30) * 100)); // 假设每个维度最多30分
  };

  const ePercentage = calculatePercentage(eiScore);
  const iPercentage = 100 - ePercentage;
  const sPercentage = calculatePercentage(snScore);
  const nPercentage = 100 - sPercentage;
  const tPercentage = calculatePercentage(tfScore);
  const fPercentage = 100 - tPercentage;
  const jPercentage = calculatePercentage(jpScore);
  const pPercentage = 100 - jPercentage;

  return {
    type,
    scores: {
      EI: eiScore,
      SN: snScore,
      TF: tfScore,
      JP: jpScore
    },
    percentage: {
      E: e === 'E' ? ePercentage : iPercentage,
      I: e === 'I' ? iPercentage : ePercentage,
      S: s === 'S' ? sPercentage : nPercentage,
      N: s === 'N' ? nPercentage : sPercentage,
      T: t === 'T' ? tPercentage : fPercentage,
      F: t === 'F' ? fPercentage : tPercentage,
      J: j === 'J' ? jPercentage : pPercentage,
      P: j === 'P' ? pPercentage : jPercentage
    }
  };
}

export function getMBTIDescription(type: MBTIType): string {
  const descriptions: Record<MBTIType, string> = {
    ISTJ: '内向、感觉、思考、判断型：务实、有条理、可靠，重视传统和秩序。',
    ISFJ: '内向、感觉、情感、判断型：友善、有责任心、注重细节，关心他人。',
    INFJ: '内向、直觉、情感、判断型：洞察力强、理想主义、有同理心，追求意义。',
    INTJ: '内向、直觉、思考、判断型：独立、理性、有远见，善于战略规划。',
    ISTP: '内向、感觉、思考、感知型：灵活、务实、善于解决问题，喜欢动手操作。',
    ISFP: '内向、感觉、情感、感知型：敏感、艺术、注重个人价值观，追求和谐。',
    INFP: '内向、直觉、情感、感知型：理想主义、有创造力、重视个人成长，追求真实性。',
    INTP: '内向、直觉、思考、感知型：理性、好奇、善于分析，追求知识和逻辑。',
    ESTP: '外向、感觉、思考、感知型：活跃、冒险、善于应对挑战，喜欢行动。',
    ESFP: '外向、感觉、情感、感知型：热情、友好、善于社交，享受当下。',
    ENFP: '外向、直觉、情感、感知型：充满活力、创意、善于沟通，追求可能性。',
    ENTP: '外向、直觉、思考、感知型：聪明、好奇、善于辩论，喜欢挑战传统。',
    ESTJ: '外向、感觉、思考、判断型：务实、果断、有组织能力，重视效率。',
    ESFJ: '外向、感觉、情感、判断型：热情、有责任心、善于社交，关心他人。',
    ENFJ: '外向、直觉、情感、判断型：有领导力、有同理心、善于激励他人，追求和谐。',
    ENTJ: '外向、直觉、思考、判断型：自信、果断、有战略思维，善于领导。'
  };

  return descriptions[type] || '未知MBTI类型';
}
