import { hexagramMap, liuYaoQuestions, type HexagramInfo } from '@/data/liuyaoHexagrams';

// 每个爻的类型
export type YaoType = 'old_yang' | 'young_yang' | 'young_yin' | 'old_yin';

export interface YaoResult {
  index: number;       // 1-6 (bottom to top)
  type: YaoType;
  isYang: boolean;     // true=阳, false=阴
  isChanging: boolean; // 老阳/老阴为变爻
  dimension: string;
}

export type LiuYaoMode = 'career' | 'divination';

export interface LiuYaoResult {
  yaos: YaoResult[];
  /** 本卦 6 位二进制（从下往上） */
  originalBinary: string;
  /** 变卦 6 位二进制（从下往上） */
  changedBinary: string | null;
  /** 本卦信息 */
  originalHexagram: HexagramInfo;
  /** 变卦信息（有变爻时） */
  changedHexagram: HexagramInfo | null;
  /** 动爻索引（从1开始），可能有多个 */
  movingYaoIndices: number[];
  /** MBTI 类型 */
  mbtiType: string;
  /** MBTI 各维度得分 */
  mbtiScores: Record<string, number>;
  /** 用户输入的问题（问卦模式） */
  userQuestion?: string;
  /** 测试模式 */
  mode: LiuYaoMode;
}

// 爻类型转阴阳
export function yaoToBinary(type: YaoType): number {
  return (type === 'old_yang' || type === 'young_yang') ? 1 : 0;
}

// 是否变爻
export function isChanging(type: YaoType): boolean {
  return type === 'old_yang' || type === 'old_yin';
}

// 变爻后的值（0↔1）
export function flipBinary(bit: number): number {
  return bit === 1 ? 0 : 1;
}

// 根据答案计算全部结果
export function calculateLiuYao(answers: YaoType[], mode: LiuYaoMode = 'career', userQuestion?: string): LiuYaoResult {
  const yaos: YaoResult[] = answers.map((type, i) => ({
    index: i + 1,
    type,
    isYang: yaoToBinary(type) === 1,
    isChanging: isChanging(type),
    dimension: liuYaoQuestions[i].dimension,
  }));

  // 本卦二进制（从下往上）
  const originalBinary = yaos.map(y => y.isYang ? '1' : '0').join('');

  // 变爻索引及变卦
  const movingYaoIndices = yaos.filter(y => y.isChanging).map(y => y.index);
  let changedBinary: string | null = null;
  let changedHexagram: HexagramInfo | null = null;

  if (movingYaoIndices.length > 0) {
    const bits: number[] = yaos.map(y => y.isYang ? 1 : 0);
    movingYaoIndices.forEach(idx => { bits[idx - 1] = flipBinary(bits[idx - 1]); });
    changedBinary = bits.join('');
    changedHexagram = hexagramMap[changedBinary] || null;
  }

  // 查找本卦
  const originalHexagram = hexagramMap[originalBinary] || {
    name: '未知', pinyin: '', meaning: '卦象无法识别', advice: ''
  };

  // MBTI 计算
  // 维度映射：初爻/五爻→EI, 二爻→SN, 三爻→TF, 四爻/上爻→JP
  const dimScores: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const dimMap: Record<number, string> = { 1: 'EI', 2: 'SN', 3: 'TF', 4: 'JP', 5: 'EI', 6: 'JP' };

  yaos.forEach(y => {
    const dim = dimMap[y.index];
    const score = y.isYang ? (y.isChanging ? 2 : 1) : (y.isChanging ? -2 : -1);
    dimScores[dim] = (dimScores[dim] || 0) + score;
  });

  const eiChar = dimScores.EI > 0 ? 'E' : 'I';
  const snChar = dimScores.SN > 0 ? 'S' : 'N';
  const tfChar = dimScores.TF > 0 ? 'T' : 'F';
  const jpChar = dimScores.JP > 0 ? 'J' : 'P';

  return {
    yaos,
    originalBinary,
    changedBinary,
    originalHexagram,
    changedHexagram,
    movingYaoIndices,
    mbtiType: eiChar + snChar + tfChar + jpChar,
    mbtiScores: dimScores,
    userQuestion,
    mode,
  };
}

/** 随机摇卦（问卦模式）—— 模拟三枚铜币投掷 */
export function randomDivination(userQuestion: string): LiuYaoResult {
  const dims = ['EI', 'SN', 'TF', 'JP', 'EI', 'JP'];
  const answers: YaoType[] = [];
  for (let i = 0; i < 6; i++) {
    // 加权随机：少阳少阴概率高，老阳老阴概率低（模拟真实铜币）
    const r = Math.random();
    if (r < 0.1) answers.push('old_yang');
    else if (r < 0.45) answers.push('young_yang');
    else if (r < 0.8) answers.push('young_yin');
    else answers.push('old_yin');
  }
  // 构建维度映射（问卦模式无 MBTI 题目，用默认维度）
  const yaos: YaoResult[] = answers.map((type, i) => ({
    index: i + 1,
    type,
    isYang: yaoToBinary(type) === 1,
    isChanging: isChanging(type),
    dimension: dims[i],
  }));
  const originalBinary = yaos.map(y => y.isYang ? '1' : '0').join('');
  const movingYaoIndices = yaos.filter(y => y.isChanging).map(y => y.index);
  let changedBinary: string | null = null;
  let changedHexagram: HexagramInfo | null = null;
  if (movingYaoIndices.length > 0) {
    const bits: number[] = yaos.map(y => y.isYang ? 1 : 0);
    movingYaoIndices.forEach(idx => { bits[idx - 1] = flipBinary(bits[idx - 1]); });
    changedBinary = bits.join('');
    changedHexagram = hexagramMap[changedBinary] || null;
  }
  const originalHexagram = hexagramMap[originalBinary] || {
    name: '未知', pinyin: '', meaning: '卦象无法识别', advice: ''
  };
  const dimScores: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const dimMap: Record<number, string> = { 1: 'EI', 2: 'SN', 3: 'TF', 4: 'JP', 5: 'EI', 6: 'JP' };
  yaos.forEach(y => {
    const dim = dimMap[y.index];
    const score = y.isYang ? (y.isChanging ? 2 : 1) : (y.isChanging ? -2 : -1);
    dimScores[dim] = (dimScores[dim] || 0) + score;
  });
  return {
    yaos,
    originalBinary,
    changedBinary,
    originalHexagram,
    changedHexagram,
    movingYaoIndices,
    mbtiType: (dimScores.EI > 0 ? 'E' : 'I') + (dimScores.SN > 0 ? 'S' : 'N') + (dimScores.TF > 0 ? 'T' : 'F') + (dimScores.JP > 0 ? 'J' : 'P'),
    mbtiScores: dimScores,
    userQuestion,
    mode: 'divination',
  };
}

// 生成分析报告
export function generateLiuYaoAnalysis(result: LiuYaoResult): string[] {
  const lines: string[] = [];

  lines.push(`本卦：${result.originalHexagram.name}（${result.originalHexagram.meaning}）`);
  lines.push(result.originalHexagram.advice);

  if (result.changedHexagram) {
    lines.push(`变卦：${result.changedHexagram.name}（${result.changedHexagram.meaning}）`);
    lines.push(`动爻：第 ${result.movingYaoIndices.join('、')} 爻变动`);
    lines.push(result.changedHexagram.advice);
  }

  // MBTI 分析
  const dimLabels: Record<string, string> = {
    EI: `精力来源：${result.mbtiType[0] === 'E' ? '外向(E)' : '内向(I)'}`,
    SN: `感知方式：${result.mbtiType[1] === 'S' ? '感觉(S)' : '直觉(N)'}`,
    TF: `决策倾向：${result.mbtiType[2] === 'T' ? '思考(T)' : '情感(F)'}`,
    JP: `生活态度：${result.mbtiType[3] === 'J' ? '判断(J)' : '感知(P)'}`,
  };

  lines.push(`推演 MBTI：${result.mbtiType}`);
  Object.entries(dimLabels).forEach(([dim, label]) => {
    const score = result.mbtiScores[dim];
    const absScore = Math.abs(score);
    const strength = absScore >= 3 ? '明显' : absScore >= 1 ? '有一定倾向' : '平衡';
    lines.push(`  ${label}（${strength}）`);
  });

  return lines;
}
