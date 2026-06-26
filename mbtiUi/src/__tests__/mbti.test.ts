import { describe, it, expect } from 'vitest';
import { calculateMBTI, getMBTIDescription } from '@/utils/mbti';
import { getCareerRecommendations } from '@/utils/careerRecommendation';

describe('calculateMBTI', () => {
  it('应正确计算 INTJ 类型', () => {
    // INTJ: EI≤0→I, SN≤0→N, TF>0→T, JP>0→J
    const result = calculateMBTI({ EI: -15, SN: -10, TF: 12, JP: 8 });
    expect(result.type).toBe('INTJ');
    expect(result.scores.EI).toBe(-15);
    expect(result.scores.SN).toBe(-10);
    expect(result.scores.TF).toBe(12);
    expect(result.scores.JP).toBe(8);
  });

  it('应正确计算 ENFP 类型', () => {
    // ENFP: EI>0→E, SN≤0→N, TF≤0→F, JP≤0→P
    const result = calculateMBTI({ EI: 12, SN: -8, TF: -10, JP: -6 });
    expect(result.type).toBe('ENFP');
  });

  it('零值应归为 I/N/F/P', () => {
    const result = calculateMBTI({ EI: 0, SN: 0, TF: 0, JP: 0 });
    expect(result.type).toBe('INFP');
  });

  it('百分比总和应为 100（E+I, S+N, T+F, J+P 各对）', () => {
    const result = calculateMBTI({ EI: 10, SN: -5, TF: 3, JP: -8 });
    expect(result.percentage.E + result.percentage.I).toBe(100);
    expect(result.percentage.S + result.percentage.N).toBe(100);
    expect(result.percentage.T + result.percentage.F).toBe(100);
    expect(result.percentage.J + result.percentage.P).toBe(100);
  });

  it('百分比应在 0-100 范围内', () => {
    const result = calculateMBTI({ EI: 30, SN: -30, TF: 20, JP: -20 });
    Object.values(result.percentage).forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    });
  });

  it('应处理空输入', () => {
    const result = calculateMBTI({});
    expect(result.type).toBe('INFP');
  });
});

describe('getMBTIDescription', () => {
  it('应为所有 16 种类型返回非空描述', () => {
    const types = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
                   'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'] as const;
    types.forEach(type => {
      const desc = getMBTIDescription(type);
      expect(desc).toBeTruthy();
      expect(desc.length).toBeGreaterThan(10);
    });
  });

  it('未知类型应返回默认文案', () => {
    const desc = getMBTIDescription('ISTJ');
    expect(desc).not.toBe('未知MBTI类型');
  });
});

describe('getCareerRecommendations', () => {
  it('应为 INTJ 推荐至少 1 个职业', () => {
    const careers = getCareerRecommendations('INTJ');
    expect(careers.length).toBeGreaterThan(0);
    careers.forEach(c => {
      expect(c.suitableTypes).toContain('INTJ');
    });
  });

  it('应为 ENFP 推荐匹配的职业', () => {
    const careers = getCareerRecommendations('ENFP');
    expect(careers.length).toBeGreaterThan(0);
    careers.forEach(c => {
      expect(c.suitableTypes).toContain('ENFP');
    });
  });

  it('所有职业应包含 id、name、description 等字段', () => {
    const careers = getCareerRecommendations('INTJ');
    careers.forEach(c => {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.description).toBeDefined();
      expect(c.skills).toBeInstanceOf(Array);
      expect(c.education).toBeInstanceOf(Array);
    });
  });
});
