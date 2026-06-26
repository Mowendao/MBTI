import type { MBTIType } from '@/types/mbti';

export interface TypeProfile {
  type: MBTIType;
  color: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  communication: string;
  careers: string[];
  famousPeople: string[];
}

export const TYPE_COLORS: Record<string, string> = {
  ISTJ: '#4A90D9', ISFJ: '#7B9BA6', INFJ: '#9B59B6', INTJ: '#2C3E50',
  ISTP: '#27AE60', ISFP: '#E67E22', INFP: '#E91E8A', INTP: '#3498DB',
  ESTP: '#F39C12', ESFP: '#FF6B6B', ENFP: '#FF9FF3', ENTP: '#00CEC9',
  ESTJ: '#2ECC71', ESFJ: '#FD79A8', ENFJ: '#6C5CE7', ENTJ: '#E74C3C',
};

const ALL_TYPES: MBTIType[] = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
];

export const ALL_MBTI_TYPES: MBTIType[] = ALL_TYPES;

export function getTypeProfile(type: MBTIType): TypeProfile {
  return profiles[type];
}

const profiles: Record<MBTIType, TypeProfile> = {
  ISTJ: {
    type: 'ISTJ', color: TYPE_COLORS.ISTJ,
    title: '务实者',
    description: '沉静、认真、贯彻始终、有条不紊。以极强的责任感和执行力著称，是团队中最可靠的支柱。注重事实和细节，做事一板一眼，信守承诺。',
    strengths: ['责任心极强，说到做到', '善于规划和组织，做事有条理', '冷静理性，情绪稳定', '注重传统和规则，维护秩序'],
    weaknesses: ['有时过于固执，不易变通', '对他人感受不够敏感', '不擅长应对突发变化', '容易陷入细节忽视大局'],
    communication: '直接、务实、简洁。喜欢事实和数据支撑的沟通，不擅长也不喜欢绕弯子的表达。',
    careers: ['审计师', '法官', '项目经理', '军官', '会计师'],
    famousPeople: ['乔治·华盛顿', '杰夫·贝索斯', '沃伦·巴菲特', '约翰·D·洛克菲勒'],
  },
  ISFJ: {
    type: 'ISFJ', color: TYPE_COLORS.ISFJ,
    title: '守护者',
    description: '沉静友善，有责任心和奉献精神，默默在背后支持他人。非常注重细节，乐于为他人创造舒适安全的环境。',
    strengths: ['极具奉献精神，乐于助人', '注重细节，工作一丝不苟', '忠诚可靠，是团队的后盾', '善于倾听，有同理心'],
    weaknesses: ['过于谦逊，不善于表达自己', '过度付出容易耗竭', '不喜欢冲突和变化', '有时难以拒绝别人'],
    communication: '温和、委婉、体谅。注重维护和谐氛围，避免直接冲突。',
    careers: ['护士', '教师', '社会工作者', '心理咨询师', '图书管理员'],
    famousPeople: ['特蕾莎修女', '碧昂丝', '凯特·米德尔顿', '安东尼·霍普金斯'],
  },
  INFJ: {
    type: 'INFJ', color: TYPE_COLORS.INFJ,
    title: '提倡者',
    description: '富有远见和洞察力，追求深刻的使命感和意义。既能理解复杂的抽象概念，又能体察他人的情绪。是 16 种类型中最稀有的类型之一。',
    strengths: ['洞察力极强，能看透本质', '有坚定的价值观和原则', '善于激励和启发他人', '创造力与同理心兼备'],
    weaknesses: ['过于理想主义，容易失望', '对批评过于敏感', '容易过度消耗自己', '有时过于神秘和封闭'],
    communication: '深度、真诚、富有感染力。喜欢有意义的深度对话，讨厌浅薄的闲聊。',
    careers: ['心理咨询师', '作家', '教育家', '人力资源经理', '设计师'],
    famousPeople: ['马丁·路德·金', '特蕾莎修女', '柏拉图', 'J·K·罗琳'],
  },
  INTJ: {
    type: 'INTJ', color: TYPE_COLORS.INTJ,
    title: '策略家',
    description: '独立、理性、有远见。善于制定长期战略，不断追求提升效率和改进系统。一旦设定目标就会坚定不移地推进。',
    strengths: ['战略思维强，善于长远规划', '独立自主，不依赖他人', '高标准严要求，追求卓越', '理性客观，决策果断'],
    weaknesses: ['容易显得冷漠和高傲', '不擅长处理office politics', '对效率低下的人缺乏耐心', '过于追求完美导致拖延'],
    communication: '精炼、逻辑、直奔主题。不喜欢闲聊，只谈有意义的事。',
    careers: ['科学家', '工程师', '律师', '投资分析师', '软件架构师'],
    famousPeople: ['埃隆·马斯克', '马克·扎克伯格', '弗莱德曼', '尼采'],
  },
  ISTP: {
    type: 'ISTP', color: TYPE_COLORS.ISTP,
    title: '巧匠者',
    description: '灵活、务实、冷静。是天生的问题解决者，擅长拆解事物背后的运作原理。喜欢动手操作和探险体验。',
    strengths: ['实践能力强，善于解决实际问题', '冷静沉着，危机时刻靠得住', '学习新技能非常快', '独立自主，不拘泥于规则'],
    weaknesses: ['容易感到无聊，缺乏持久力', '不擅长表达情感', '过于追求自由，不喜欢承诺', '有时冒险过度'],
    communication: '简洁、直接、不爱啰嗦。更喜欢用行动而非语言来表达。',
    careers: ['工程师', '飞行员', '消防员', '外科医生', '赛车手'],
    famousPeople: ['史蒂夫·乔布斯', '汤姆·克鲁斯', '克林特·伊斯特伍德', '贝尔·格里尔斯'],
  },
  ISFP: {
    type: 'ISFP', color: TYPE_COLORS.ISFP,
    title: '探险家',
    description: '温柔、有艺术气质、注重个人感受。用独特的审美和创造力表达自己，追求自由和真实的生活体验。',
    strengths: ['审美敏锐，富有艺术天赋', '温柔体贴，善解人意', '适应能力强，随遇而安', '真诚不做作，忠于自我'],
    weaknesses: ['过于害羞，不善于自我推销', '容易被批评伤害', '缺乏长远规划', '回避冲突和困难决定'],
    communication: '温和、委婉、富有艺术性。更倾向于用作品和行动表达。',
    careers: ['画家', '摄影师', '时装设计师', '园林设计师', '音乐人'],
    famousPeople: ['迈克尔·杰克逊', '奥黛丽·赫本', '弗雷迪·默丘里', '文森特·梵高'],
  },
  INFP: {
    type: 'INFP', color: TYPE_COLORS.INFP,
    title: '调停者',
    description: '理想主义、富有创造力、追求真实性。拥有丰富的内心世界和坚定的价值观，致力于让世界变得更美好。',
    strengths: ['创造力丰富，想象力出众', '热情真诚，追求深度关系', '原则性强，为信念发声', '善于理解和体谅他人'],
    weaknesses: ['过于理想化，容易失望', '决策困难，优柔寡断', '容易情绪化', '对批评过于敏感'],
    communication: '温暖、真诚、富有诗意。喜欢通过写作或艺术表达内心。',
    careers: ['作家', '心理咨询师', '编辑', '非营利组织工作者', '翻译'],
    famousPeople: ['莎士比亚', 'J·R·R·托尔金', '刘慈欣', '约翰·列侬'],
  },
  INTP: {
    type: 'INTP', color: TYPE_COLORS.INTP,
    title: '思考者',
    description: '理性、好奇、热爱理论。拥有强大的分析和逻辑能力，对知识和真理有着永不满足的追求。',
    strengths: ['逻辑分析能力极强', '思维开阔，善于创新', '客观公正，不带偏见', '学习能力强，知识面广'],
    weaknesses: ['容易过度分析，不够果断', '忽视实际细节', '社交方面略显笨拙', '对规则和权威不耐烦'],
    communication: '逻辑严密、喜欢辩论、精确定义。追求概念上的准确和严谨。',
    careers: ['科学家', '软件工程师', '大学教授', '哲学家', '数据分析师'],
    famousPeople: ['阿尔伯特·爱因斯坦', '比尔·盖茨', '查尔斯·达尔文', '勒内·笛卡尔'],
  },
  ESTP: {
    type: 'ESTP', color: TYPE_COLORS.ESTP,
    title: '推动者',
    description: '精力充沛、行动力强、善于说服。是天生的商业人才和危机处理专家，善于抓住机会并快速行动。',
    strengths: ['行动力极强，做事果断', '口才好，善于说服谈判', '适应能力强，随机应变', '社交魅力四射'],
    weaknesses: ['容易冲动，缺乏耐心', '不喜欢长期规划', '过于好胜，爱出风头', '不善于处理枯燥重复的工作'],
    communication: '直接、有感染力、风趣。善于调动气氛和说服他人。',
    careers: ['企业家', '销售经理', '演员', '体育运动员', '投资顾问'],
    famousPeople: ['唐纳德·特朗普', '小罗伯特·唐尼', '麦当娜', '温斯顿·丘吉尔'],
  },
  ESFP: {
    type: 'ESFP', color: TYPE_COLORS.ESFP,
    title: '表演者',
    description: '热情开朗、活力四射、善于社交。是天生的表演者和气氛活跃者，享受站在聚光灯下的感觉。',
    strengths: ['热情洋溢，感染力强', '善于社交，人缘极好', '乐观积极，充满正能量', '审美在线，懂得品味生活'],
    weaknesses: ['容易分心，不够专注', '回避深层次问题', '过于在意外界评价', '财务管理能力偏弱'],
    communication: '生动活泼、富有表现力。喜欢讲故事和分享有趣经历。',
    careers: ['演员', '主持人', '旅游达人', '公关专员', '培训师'],
    famousPeople: ['玛丽莲·梦露', '迈克尔·乔丹', '比尔·克林顿', '帕丽斯·希尔顿'],
  },
  ENFP: {
    type: 'ENFP', color: TYPE_COLORS.ENFP,
    title: '激励者',
    description: '充满热情、富有创造力、善于发现他人潜能。总能给周围带来正能量，善于看到各种可能性。',
    strengths: ['创意无限，思维活跃', '善于激励和鼓舞他人', '同理心强，人际关系好', '适应力强，拥抱变化'],
    weaknesses: ['容易分心，执行力偏弱', '过于情绪化', '对细节缺乏耐心', '做决定时容易犹豫'],
    communication: '热情、鼓舞、充满感染力。擅长用故事和愿景打动人心。',
    careers: ['记者', '广告创意', '职业规划师', '培训讲师', '心理咨询师'],
    famousPeople: ['罗宾·威廉姆斯', '罗伯特·唐尼', '艾米丽·狄金森', '斯皮尔伯格'],
  },
  ENTP: {
    type: 'ENTP', color: TYPE_COLORS.ENTP,
    title: '辩论家',
    description: '聪明、好奇、善于挑战。喜欢从不同角度看问题，享受思想的碰撞。是天生的创新者和创业家。',
    strengths: ['思维敏捷，口才出众', '创新能力强，脑洞大', '适应力强，善于应变', '视野开阔，知识渊博'],
    weaknesses: ['好胜心强，爱抬杠', '容易半途而废', '不善于执行重复性工作', '有时不够体贴他人感受'],
    communication: '聪明风趣、喜欢辩论。享受思维碰撞的过程。',
    careers: ['创业者', '律师', '产品经理', '咨询师', '发明家'],
    famousPeople: ['达芬奇', '托马斯·爱迪生', '史蒂夫·乔布斯', '福尔摩斯'],
  },
  ESTJ: {
    type: 'ESTJ', color: TYPE_COLORS.ESTJ,
    title: '监督者',
    description: '务实果断、有组织能力、天生的管理者。恪守规则和程序，追求效率和秩序。',
    strengths: ['领导力强，善于管理', '做事高效，执行力一流', '正直可靠，原则性强', '组织规划能力出众'],
    weaknesses: ['容易专断，不灵活', '对他人要求过高', '不善于处理情感问题', '抗拒变化和新技术'],
    communication: '直接有力、命令式。讲究效率，直奔主题。',
    careers: ['企业管理者', '法官', '军官', '常务总监', '校长'],
    famousPeople: ['亨利·福特', '宋庆龄', '拿破仑', '山姆·沃尔顿'],
  },
  ESFJ: {
    type: 'ESFJ', color: TYPE_COLORS.ESFJ,
    title: '关怀者',
    description: '热情友善、有责任心、乐于助人。非常重视人际和谐，善于营造温暖融洽的团队氛围。',
    strengths: ['社交能力强，人缘好', '有责任心，使命必达', '乐于助人，温暖体贴', '组织协调能力好'],
    weaknesses: ['过度在意他人评价', '对批评难以接受', '有时过于唠叨', '不擅长处理抽象概念'],
    communication: '温和亲切、注重礼貌。关心他人感受，善于维护团队和谐。',
    careers: ['教师', '护士', '人力资源经理', '客服经理', '社区工作者'],
    famousPeople: ['泰勒·斯威夫特', '艾薇儿', '詹妮弗·加纳', '比尔·克林顿'],
  },
  ENFJ: {
    type: 'ENFJ', color: TYPE_COLORS.ENFJ,
    title: '主人公',
    description: '天生领导者，有强大的感召力和同理心。善于发现每个人的潜力，并激励他们成长为最好的自己。',
    strengths: ['领导力和感召力极强', '同理心丰富，善于理解他人', '沟通表达能力强', '有远见，善于规划'],
    weaknesses: ['过于理想化', '容易过度投入他人的问题', '对批评和冲突敏感', '有时忽略自己的需求'],
    communication: '温暖有力、充满感染力。善于用愿景和情感激励团队。',
    careers: ['培训总监', '企业培训师', '公关经理', '教育家', '人力资源总监'],
    famousPeople: ['马丁·路德·金', '奥普拉·温弗瑞', '纳尔逊·曼德拉', '甘地'],
  },
  ENTJ: {
    type: 'ENTJ', color: TYPE_COLORS.ENTJ,
    title: '指挥官',
    description: '自信果断、远见卓识、天生战略家。具备强大的领导力和执行力，擅长将长远规划变为现实。',
    strengths: ['战略眼光出色', '决策果断，执行力强', '领导力卓越', '理性客观，效率至上'],
    weaknesses: ['容易显得强势傲慢', '对效率低下零容忍', '不善于处理情感需求', '工作狂倾向'],
    communication: '直接有力、逻辑清晰。表达观点时自信而果断。',
    careers: ['CEO', '企业战略顾问', '法官', '政治家', '投资银行家'],
    famousPeople: ['杰克·韦尔奇', '玛格丽特·撒切尔', '比尔·盖茨', '成吉思汗'],
  },
};

export const famousPeopleByType: Record<MBTIType, string> = {
  ISTJ: '"说到做到，就是我的名片"',
  ISFJ: '"用行动温暖这个世界"',
  INFJ: '"改变世界，从理解人心开始"',
  INTJ: '"谋定而后动"',
  ISTP: '"动手解决一切问题"',
  ISFP: '"用美和善意表达内心"',
  INFP: '"梦想是改变世界的力量"',
  INTP: '"思考，是最高级的娱乐"',
  ESTP: '"机会永远留给行动派"',
  ESFP: '"生活就是一场盛大的表演"',
  ENFP: '"点亮每一个可能"',
  ENTP: '"打破常规，才有创新"',
  ESTJ: '"规则和秩序是效率的根基"',
  ESFJ: '"让每个人都被温暖以待"',
  ENFJ: '"成就他人，就是最大的成就"',
  ENTJ: '"远见与行动，改变世界的力量"',
};
