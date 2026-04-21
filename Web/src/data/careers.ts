import { Career, MBTIType } from '../types/mbti';

export const careers: Career[] = [
  {
    id: 1,
    name: '软件工程师',
    description: '设计、开发和维护软件系统，解决复杂的技术问题。',
    suitableTypes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    skills: ['编程', '问题解决', '逻辑思维', '团队合作'],
    education: ['计算机科学', '软件工程', '相关技术专业']
  },
  {
    id: 2,
    name: '教师',
    description: '教育学生，帮助他们学习知识和技能，培养他们的个人发展。',
    suitableTypes: ['INFJ', 'ENFJ', 'ISFJ', 'ESFJ'],
    skills: ['沟通', '耐心', '创造力', '组织能力'],
    education: ['教育学', '相关学科专业']
  },
  {
    id: 3,
    name: '医生',
    description: '诊断和治疗疾病，关心患者的健康和福祉。',
    suitableTypes: ['INFJ', 'ISFJ', 'ENFJ', 'ESFJ'],
    skills: ['同理心', '责任感', '专注力', '决策能力'],
    education: ['医学', '相关健康专业']
  },
  {
    id: 4,
    name: '市场营销专员',
    description: '推广产品和服务，制定营销策略，与客户沟通。',
    suitableTypes: ['ENFP', 'ENTP', 'ESFP', 'ESTP'],
    skills: ['沟通', '创造力', '分析能力', '社交能力'],
    education: ['市场营销', '商务管理', '相关专业']
  },
  {
    id: 5,
    name: '会计师',
    description: '管理财务记录，准备财务报表，确保财务合规。',
    suitableTypes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    skills: ['细心', '分析能力', '组织能力', '诚信'],
    education: ['会计学', '财务管理', '相关专业']
  },
  {
    id: 6,
    name: '心理咨询师',
    description: '帮助人们解决心理问题，提供情感支持和心理治疗。',
    suitableTypes: ['INFJ', 'ENFJ', 'INFP', 'ENFP'],
    skills: ['同理心', '倾听', '沟通', '分析能力'],
    education: ['心理学', '心理咨询', '相关专业']
  },
  {
    id: 7,
    name: '建筑师',
    description: '设计建筑物和空间，考虑功能、美观和可持续性。',
    suitableTypes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    skills: ['创造力', '空间思维', '问题解决', '技术能力'],
    education: ['建筑学', '相关设计专业']
  },
  {
    id: 8,
    name: '销售代表',
    description: '向客户销售产品和服务，建立和维护客户关系。',
    suitableTypes: ['ESTP', 'ESFP', 'ENTP', 'ENFP'],
    skills: ['沟通', '说服能力', '社交能力', '目标导向'],
    education: ['市场营销', '商务管理', '相关专业']
  },
  {
    id: 9,
    name: '人力资源专员',
    description: '招聘、培训和管理员工，维护公司的人力资源政策。',
    suitableTypes: ['ESFJ', 'ISFJ', 'ENFJ', 'INFJ'],
    skills: ['沟通', '组织能力', '同理心', '解决冲突'],
    education: ['人力资源管理', '心理学', '相关专业']
  },
  {
    id: 10,
    name: '律师',
    description: '提供法律咨询，代表客户处理法律事务，参与诉讼。',
    suitableTypes: ['INTJ', 'ENTJ', 'ISTJ', 'ESTJ'],
    skills: ['分析能力', '沟通', '逻辑思维', '说服力'],
    education: ['法学', '相关法律专业']
  },
  {
    id: 11,
    name: '艺术家',
    description: '创作艺术作品，表达情感和想法，与观众交流。',
    suitableTypes: ['INFP', 'ISFP', 'ENFP', 'ESFP'],
    skills: ['创造力', '表达能力', '想象力', '专注力'],
    education: ['艺术', '设计', '相关创意专业']
  },
  {
    id: 12,
    name: '项目经理',
    description: '规划、执行和监控项目，确保项目按时、按预算完成。',
    suitableTypes: ['ENTJ', 'ESTJ', 'INTJ', 'ISTJ'],
    skills: ['领导能力', '组织能力', '沟通', '问题解决'],
    education: ['项目管理', '商务管理', '相关专业']
  },
  {
    id: 13,
    name: '研究员',
    description: '进行科学研究，探索新的知识和技术，发表研究成果。',
    suitableTypes: ['INTP', 'INTJ', 'ENTP', 'ENTJ'],
    skills: ['分析能力', '批判性思维', '专注力', '解决问题'],
    education: ['相关学科博士或硕士学位']
  },
  {
    id: 14,
    name: '护士',
    description: '照顾患者，协助医生进行治疗，提供医疗护理。',
    suitableTypes: ['ISFJ', 'ESFJ', 'INFJ', 'ENFJ'],
    skills: ['同理心', '责任感', '沟通', '应变能力'],
    education: ['护理学', '相关健康专业']
  },
  {
    id: 15,
    name: '企业家',
    description: '创办和管理企业，识别商业机会，承担风险。',
    suitableTypes: ['ENTP', 'ENTJ', 'ESTP', 'ENFP'],
    skills: ['创造力', '冒险精神', '领导能力', '决策能力'],
    education: ['商务管理', '创业学', '相关专业']
  },
  {
    id: 16,
    name: '设计师',
    description: '设计产品、界面或空间，结合美学和功能。',
    suitableTypes: ['INFP', 'ISFP', 'ENFP', 'ESFP'],
    skills: ['创造力', '审美能力', '问题解决', '沟通'],
    education: ['设计', '艺术', '相关创意专业']
  },
  {
    id: 17,
    name: '工程师',
    description: '设计、建造和维护各种系统和结构，解决技术问题。',
    suitableTypes: ['ISTP', 'INTP', 'ESTP', 'ENTP'],
    skills: ['技术能力', '问题解决', '逻辑思维', '团队合作'],
    education: ['工程学', '相关技术专业']
  },
  {
    id: 18,
    name: '记者',
    description: '收集和报道新闻，调查事件，撰写文章。',
    suitableTypes: ['ENFP', 'ENTP', 'ESFP', 'ESTP'],
    skills: ['沟通', '调查能力', '写作', '适应能力'],
    education: ['新闻学', '传播学', '相关专业']
  },
  {
    id: 19,
    name: '金融分析师',
    description: '分析金融市场，评估投资机会，提供财务建议。',
    suitableTypes: ['INTJ', 'ISTJ', 'ENTJ', 'ESTJ'],
    skills: ['分析能力', '数学能力', '决策能力', '专注力'],
    education: ['金融学', '经济学', '相关专业']
  },
  {
    id: 20,
    name: '社会工作者',
    description: '帮助弱势群体，提供社会服务，促进社会公正。',
    suitableTypes: ['ISFJ', 'ESFJ', 'INFJ', 'ENFJ'],
    skills: ['同理心', '沟通', '解决问题', '组织能力'],
    education: ['社会工作', '社会学', '相关专业']
  }
];
