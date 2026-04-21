import { Question } from '../types/mbti';

export const questions: Question[] = [
  // EI维度题目
  {
    id: 1,
    text: '你更喜欢？',
    dimension: 'EI',
    options: [
      { text: '参加热闹的聚会', value: 1 },
      { text: '安静地独处', value: 7 }
    ]
  },
  {
    id: 2,
    text: '你倾向于？',
    dimension: 'EI',
    options: [
      { text: '通过与人交流来获取能量', value: 1 },
      { text: '通过独自思考来获取能量', value: 7 }
    ]
  },
  {
    id: 3,
    text: '在社交场合中，你通常是？',
    dimension: 'EI',
    options: [
      { text: '主动与他人交流', value: 1 },
      { text: '等待他人主动交流', value: 7 }
    ]
  },
  {
    id: 4,
    text: '你更喜欢？',
    dimension: 'EI',
    options: [
      { text: '户外活动', value: 1 },
      { text: '室内活动', value: 7 }
    ]
  },
  {
    id: 5,
    text: '当你感到压力时，你会？',
    dimension: 'EI',
    options: [
      { text: '找朋友倾诉', value: 1 },
      { text: '独自处理', value: 7 }
    ]
  },

  // SN维度题目
  {
    id: 6,
    text: '你更关注？',
    dimension: 'SN',
    options: [
      { text: '具体的事实和细节', value: 1 },
      { text: '抽象的概念和可能性', value: 7 }
    ]
  },
  {
    id: 7,
    text: '你倾向于？',
    dimension: 'SN',
    options: [
      { text: '基于经验做决定', value: 1 },
      { text: '基于想象做决定', value: 7 }
    ]
  },
  {
    id: 8,
    text: '你更相信？',
    dimension: 'SN',
    options: [
      { text: '可以看到和触摸的事物', value: 1 },
      { text: '直觉和预感', value: 7 }
    ]
  },
  {
    id: 9,
    text: '你更喜欢？',
    dimension: 'SN',
    options: [
      { text: '实际可行的计划', value: 1 },
      { text: '有创意的想法', value: 7 }
    ]
  },
  {
    id: 10,
    text: '你对新事物的态度是？',
    dimension: 'SN',
    options: [
      { text: '先了解其实际用途', value: 1 },
      { text: '先探索其可能性', value: 7 }
    ]
  },

  // TF维度题目
  {
    id: 11,
    text: '做决定时，你更看重？',
    dimension: 'TF',
    options: [
      { text: '逻辑和客观分析', value: 1 },
      { text: '情感和个人价值观', value: 7 }
    ]
  },
  {
    id: 12,
    text: '你倾向于？',
    dimension: 'TF',
    options: [
      { text: '直接表达自己的想法', value: 1 },
      { text: '考虑他人感受后再表达', value: 7 }
    ]
  },
  {
    id: 13,
    text: '你认为公正意味着？',
    dimension: 'TF',
    options: [
      { text: '对所有人一视同仁', value: 1 },
      { text: '考虑每个人的具体情况', value: 7 }
    ]
  },
  {
    id: 14,
    text: '你更关注？',
    dimension: 'TF',
    options: [
      { text: '任务的完成', value: 1 },
      { text: '团队的和谐', value: 7 }
    ]
  },
  {
    id: 15,
    text: '在冲突中，你通常会？',
    dimension: 'TF',
    options: [
      { text: '理性分析问题', value: 1 },
      { text: '关注双方情感', value: 7 }
    ]
  },

  // JP维度题目
  {
    id: 16,
    text: '你更喜欢？',
    dimension: 'JP',
    options: [
      { text: '有计划、有条理的生活', value: 1 },
      { text: '灵活、随性的生活', value: 7 }
    ]
  },
  {
    id: 17,
    text: '面对最后期限，你会？',
    dimension: 'JP',
    options: [
      { text: '提前完成', value: 1 },
      { text: '临近截止时完成', value: 7 }
    ]
  },
  {
    id: 18,
    text: '你更倾向于？',
    dimension: 'JP',
    options: [
      { text: '做出决定并坚持', value: 1 },
      { text: '保持开放选项', value: 7 }
    ]
  },
  {
    id: 19,
    text: '你对变化的态度是？',
    dimension: 'JP',
    options: [
      { text: '需要时间适应', value: 1 },
      { text: '视为新机会', value: 7 }
    ]
  },
  {
    id: 20,
    text: '你更喜欢？',
    dimension: 'JP',
    options: [
      { text: '明确的规则和结构', value: 1 },
      { text: '自由的环境', value: 7 }
    ]
  }
];
