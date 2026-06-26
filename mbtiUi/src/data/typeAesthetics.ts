import type { MBTIType } from '@/types/mbti';

export interface TypeAesthetic {
  type: MBTIType;
  element: string;      // 火/水/风/土
  elementIcon: string;  // 🔥💨🌊🌍
  season: string;       // 春/夏/秋/冬
  seasonIcon: string;   // 🌸☀️🍂❄️
  time: string;         // 晨/午/暮/夜
  timeIcon: string;     // 🌅☀️🌙🌃
  vibe: string[];       // 3个氛围词
  palette: string[];    // 5色配色
  symbol: string;       // 象征物
  symbolIcon: string;   // emoji
  motto: string;        // 一句话宣言
}

export const TYPE_AESTHETICS: Record<MBTIType, TypeAesthetic> = {
  ISTJ: {
    type: 'ISTJ', element: '土', elementIcon: '🌍', season: '冬', seasonIcon: '❄️', time: '晨', timeIcon: '🌅',
    vibe: ['沉稳', '可靠', '秩序'], palette: ['#2C3E50', '#4A90D9', '#ECEFF1', '#78909C', '#1A237E'],
    symbol: '橡树', symbolIcon: '🌳', motto: '根基稳固，方能枝繁叶茂。',
  },
  ISFJ: {
    type: 'ISFJ', element: '土', elementIcon: '🌍', season: '秋', seasonIcon: '🍂', time: '晨', timeIcon: '🌅',
    vibe: ['温暖', '细腻', '守护'], palette: ['#7B9BA6', '#A8C5D0', '#F5F0E8', '#D4A574', '#5D7A8A'],
    symbol: '摇篮', symbolIcon: '🪺', motto: '用温暖的手，守护每一寸温柔。',
  },
  INFJ: {
    type: 'INFJ', element: '水', elementIcon: '🌊', season: '冬', seasonIcon: '❄️', time: '暮', timeIcon: '🌙',
    vibe: ['深邃', '神秘', '悲悯'], palette: ['#9B59B6', '#6C5CE7', '#2D3436', '#DFE6E9', '#A29BFE'],
    symbol: '深海', symbolIcon: '🐋', motto: '看见别人看不见的，承担别人不愿承担的。',
  },
  INTJ: {
    type: 'INTJ', element: '风', elementIcon: '💨', season: '冬', seasonIcon: '❄️', time: '夜', timeIcon: '🌃',
    vibe: ['孤傲', '远见', '冷静'], palette: ['#2C3E50', '#1A1A2E', '#E2E8F0', '#4A4A6A', '#0F3460'],
    symbol: '鹰', symbolIcon: '🦅', motto: '谋定后动，知止有得。',
  },
  ISTP: {
    type: 'ISTP', element: '火', elementIcon: '🔥', season: '夏', seasonIcon: '☀️', time: '午', timeIcon: '☀️',
    vibe: ['干练', '自由', '冒险'], palette: ['#27AE60', '#2C3E50', '#E67E22', '#BDC3C7', '#1ABC9C'],
    symbol: '齿轮', symbolIcon: '⚙️', motto: '动手解决一切问题。',
  },
  ISFP: {
    type: 'ISFP', element: '水', elementIcon: '🌊', season: '春', seasonIcon: '🌸', time: '暮', timeIcon: '🌙',
    vibe: ['柔美', '敏感', '纯真'], palette: ['#E67E22', '#F39C12', '#FDEBD0', '#D35400', '#F8C471'],
    symbol: '溪流', symbolIcon: '🏞️', motto: '用心感受，用美表达。',
  },
  INFP: {
    type: 'INFP', element: '水', elementIcon: '🌊', season: '秋', seasonIcon: '🍂', time: '暮', timeIcon: '🌙',
    vibe: ['诗意', '浪漫', '理想'], palette: ['#E91E8A', '#9B59B6', '#F8E8F0', '#FF9FF3', '#6C5CE7'],
    symbol: '蝴蝶', symbolIcon: '🦋', motto: '梦想是改变世界的力量。',
  },
  INTP: {
    type: 'INTP', element: '风', elementIcon: '💨', season: '冬', seasonIcon: '❄️', time: '夜', timeIcon: '🌃',
    vibe: ['理性', '好奇', '超然'], palette: ['#3498DB', '#2C3E50', '#ECF0F1', '#95A5A6', '#2980B9'],
    symbol: '星云', symbolIcon: '🌌', motto: '思考，是最高级的娱乐。',
  },
  ESTP: {
    type: 'ESTP', element: '火', elementIcon: '🔥', season: '夏', seasonIcon: '☀️', time: '午', timeIcon: '☀️',
    vibe: ['活力', '冒险', '魅力'], palette: ['#F39C12', '#E74C3C', '#FAD7A0', '#D35400', '#F5B041'],
    symbol: '火焰', symbolIcon: '🔥', motto: '机会永远留给行动派。',
  },
  ESFP: {
    type: 'ESFP', element: '火', elementIcon: '🔥', season: '夏', seasonIcon: '☀️', time: '昼', timeIcon: '☀️',
    vibe: ['热情', '闪耀', '欢乐'], palette: ['#FF6B6B', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'],
    symbol: '彩虹', symbolIcon: '🌈', motto: '生活就是一场盛大的表演。',
  },
  ENFP: {
    type: 'ENFP', element: '风', elementIcon: '💨', season: '春', seasonIcon: '🌸', time: '晨', timeIcon: '🌅',
    vibe: ['自由', '创意', '温暖'], palette: ['#FF9FF3', '#F368E0', '#F8E8F0', '#FFC0CB', '#EE5A24'],
    symbol: '蒲公英', symbolIcon: '🌼', motto: '点亮每一个可能。',
  },
  ENTP: {
    type: 'ENTP', element: '风', elementIcon: '💨', season: '春', seasonIcon: '🌸', time: '昼', timeIcon: '☀️',
    vibe: ['机敏', '叛逆', '革新'], palette: ['#00CEC9', '#0984E3', '#DFE6E9', '#74B9FF', '#00B894'],
    symbol: '闪电', symbolIcon: '⚡', motto: '打破常规，才有创新。',
  },
  ESTJ: {
    type: 'ESTJ', element: '火', elementIcon: '🔥', season: '夏', seasonIcon: '☀️', time: '晨', timeIcon: '🌅',
    vibe: ['正直', '高效', '果断'], palette: ['#2ECC71', '#27AE60', '#F1C40F', '#2C3E50', '#1E8449'],
    symbol: '盾牌', symbolIcon: '🛡️', motto: '规则和秩序是效率的根基。',
  },
  ESFJ: {
    type: 'ESFJ', element: '土', elementIcon: '🌍', season: '夏', seasonIcon: '☀️', time: '昼', timeIcon: '☀️',
    vibe: ['热忱', '体贴', '亲和'], palette: ['#FD79A8', '#FDCB6E', '#F5F0E8', '#E17055', '#6C5CE7'],
    symbol: '向日葵', symbolIcon: '🌻', motto: '让每个人都被温暖以待。',
  },
  ENFJ: {
    type: 'ENFJ', element: '火', elementIcon: '🔥', season: '春', seasonIcon: '🌸', time: '晨', timeIcon: '🌅',
    vibe: ['感召', '大爱', '引领'], palette: ['#6C5CE7', '#A29BFE', '#F5F0E8', '#FD79A8', '#00CEC9'],
    symbol: '太阳', symbolIcon: '☀️', motto: '成就他人，就是最大的成就。',
  },
  ENTJ: {
    type: 'ENTJ', element: '火', elementIcon: '🔥', season: '夏', seasonIcon: '☀️', time: '晨', timeIcon: '🌅',
    vibe: ['霸气', '远略', '果决'], palette: ['#E74C3C', '#2C3E50', '#F5F5F5', '#C0392B', '#1A1A2E'],
    symbol: '狮子', symbolIcon: '🦁', motto: '远见与行动，改变世界的力量。',
  },
};

export const ELEMENT_MAP: Record<string, { label: string; desc: string; types: MBTIType[] }> = {
  '火': { label: '火', desc: '热情如焰，行动力强，充满能量与感染力', types: ['ISTP', 'ESTP', 'ESFP', 'ESTJ', 'ENFJ', 'ENTJ'] },
  '水': { label: '水', desc: '深沉如水，感性细腻，富有洞察力与同理心', types: ['INFJ', 'ISFP', 'INFP'] },
  '风': { label: '风', desc: '自由如风，思维敏捷，追求创新与变化', types: ['INTJ', 'INTP', 'ENFP', 'ENTP'] },
  '土': { label: '土', desc: '沉稳如土，踏实可靠，注重秩序与责任', types: ['ISTJ', 'ISFJ', 'ESFJ'] },
};

export const SEASON_MAP: Record<string, { icon: string; desc: string }> = {
  '春': { icon: '🌸', desc: '生机盎然，充满希望与创造力' },
  '夏': { icon: '☀️', desc: '热烈奔放，活力四射，行动力强' },
  '秋': { icon: '🍂', desc: '沉静内敛，细腻丰富，富有诗意' },
  '冬': { icon: '❄️', desc: '冷静深邃，独立自省，理性克制' },
};
