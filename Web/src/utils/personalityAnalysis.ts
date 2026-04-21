import { MBTIType, TestResult } from '../types/mbti';

interface PersonalityInsight {
  title: string;
  description: string;
  tips: string[];
}

interface PersonalityReport {
  strengths: PersonalityInsight;
  weaknesses: PersonalityInsight;
  learningStyle: PersonalityInsight;
  careerFit: PersonalityInsight;
  relationshipStyle: PersonalityInsight;
}

export function generatePersonalityReport(result: TestResult): PersonalityReport {
  const { type } = result;
  
  // 基于MBTI类型生成详细的性格分析
  const insights: Record<MBTIType, PersonalityReport> = {
    ISTJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个务实、可靠、有责任感的人，善于制定计划并严格执行。',
        tips: ['充分发挥你的组织能力', '利用你的可靠性建立信任', '在团队中担任稳定的角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于注重细节，对变化适应较慢，有时会显得过于严肃。',
        tips: ['学会灵活应对变化', '尝试从不同角度看问题', '适当放松，享受过程']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于结构化、实用性的学习方式，喜欢明确的目标和步骤。',
        tips: ['制定详细的学习计划', '注重实践应用', '寻找有经验的导师指导']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要稳定性、精确性和责任感的职业。',
        tips: ['考虑会计、工程、法律等领域', '寻找有明确结构的工作环境', '发挥你的组织和管理能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你重视忠诚和稳定，是可靠的朋友和伴侣。',
        tips: ['学会表达情感', '对他人的感受保持敏感', '在关系中保持开放的沟通']
      }
    },
    ISFJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个温暖、有同情心、善于照顾他人的人，注重和谐与稳定。',
        tips: ['充分发挥你的同理心', '利用你的组织能力帮助他人', '在团队中担任协调者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于关注他人需求而忽视自己，对批评敏感，有时会显得过于传统。',
        tips: ['学会照顾自己的需求', '接受建设性批评', '保持开放的心态面对新事物']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过实际应用和与他人互动来学习，注重细节和实用性。',
        tips: ['参与小组学习', '将学习内容与实际生活联系', '寻找有情感支持的学习环境']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要人际互动、关怀和组织能力的职业。',
        tips: ['考虑教育、医疗、社会工作等领域', '寻找能够帮助他人的工作', '发挥你的组织和协调能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个忠诚、体贴、善于照顾他人的朋友和伴侣。',
        tips: ['学会表达自己的需求', '设定健康的边界', '在关系中保持平衡']
      }
    },
    INFJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个有洞察力、理想主义、有同理心的人，善于理解他人的感受和需求。',
        tips: ['充分发挥你的直觉和洞察力', '利用你的创造力解决问题', '在团队中担任引导者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于理想主义，对自己和他人要求过高，有时会显得过于敏感。',
        tips: ['学会接受现实的局限性', '设定合理的期望', '照顾好自己的情绪健康']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过深入思考和理论分析来学习，注重意义和价值。',
        tips: ['探索抽象概念和理论', '与志同道合的人讨论', '将学习与个人价值观联系']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要创造力、洞察力和人际关怀的职业。',
        tips: ['考虑心理咨询、教育、艺术等领域', '寻找能够实现个人价值的工作', '发挥你的直觉和创造力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个深度、真诚、有同理心的朋友和伴侣。',
        tips: ['学会在关系中保持平衡', '与能够理解你深度的人建立联系', '保持开放和诚实的沟通']
      }
    },
    INTJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个独立、理性、有远见的人，善于战略规划和解决复杂问题。',
        tips: ['充分发挥你的分析能力', '利用你的战略思维', '在团队中担任领导者或顾问角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于理性而忽视情感因素，对他人的能力要求过高，有时会显得过于自信。',
        tips: ['学会考虑他人的感受', '保持开放的心态接受反馈', '培养团队合作能力']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过独立研究和深度分析来学习，注重逻辑和效率。',
        tips: ['探索复杂的理论和概念', '设定明确的学习目标', '寻找能够挑战你思维的学习材料']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要战略思维、创新和解决复杂问题的职业。',
        tips: ['考虑科技、金融、咨询等领域', '寻找能够独立工作的环境', '发挥你的分析和规划能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个理性、忠诚、有深度的朋友和伴侣。',
        tips: ['学会表达情感', '对他人的感受保持敏感', '在关系中保持平衡']
      }
    },
    // 其他MBTI类型的分析可以根据需要添加
    ISTP: {
      strengths: {
        title: '核心优势',
        description: '你是一个灵活、务实、善于解决问题的人，喜欢动手操作和实际体验。',
        tips: ['充分发挥你的动手能力', '利用你的适应能力', '在团队中担任技术专家角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于冲动，对长期规划缺乏兴趣，有时会显得过于独立。',
        tips: ['学会制定长期目标', '培养耐心', '加强团队合作能力']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过实践和体验来学习，注重实用性和即时反馈。',
        tips: ['参与动手实践项目', '寻找有实际应用的学习内容', '通过尝试和错误学习']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要动手能力、解决问题和适应变化的职业。',
        tips: ['考虑技术、工程、户外工作等领域', '寻找能够提供多样性的工作', '发挥你的解决问题能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个独立、务实、有趣的朋友和伴侣。',
        tips: ['学会表达情感', '在关系中保持承诺', '与他人分享你的想法和感受']
      }
    },
    ISFP: {
      strengths: {
        title: '核心优势',
        description: '你是一个敏感、艺术、注重个人价值观的人，善于表达和创造。',
        tips: ['充分发挥你的创造力', '利用你的同理心', '在团队中担任创意角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于敏感，对冲突感到不适，有时会显得缺乏组织性。',
        tips: ['学会应对冲突', '培养组织能力', '设定明确的目标']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过个人体验和情感连接来学习，注重意义和真实性。',
        tips: ['参与创造性活动', '将学习与个人价值观联系', '在支持性环境中学习']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要创造力、表达和个人价值的职业。',
        tips: ['考虑艺术、设计、社会工作等领域', '寻找能够表达个人风格的工作', '发挥你的创造力和同理心']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个温柔、真诚、有创造力的朋友和伴侣。',
        tips: ['学会表达自己的需求', '在关系中保持真实性', '与能够理解你情感的人建立联系']
      }
    },
    INFP: {
      strengths: {
        title: '核心优势',
        description: '你是一个理想主义、有创造力、重视个人成长的人，善于理解他人。',
        tips: ['充分发挥你的创造力', '利用你的同理心', '在团队中担任理想主义者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于理想主义，对现实感到失望，有时会显得过于敏感。',
        tips: ['学会接受现实的局限性', '设定合理的期望', '培养应对压力的能力']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过个人探索和意义建构来学习，注重价值观和个人成长。',
        tips: ['探索与个人价值观相关的主题', '通过反思和写作学习', '与志同道合的人讨论']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要创造力、理想主义和个人价值的职业。',
        tips: ['考虑艺术、教育、心理咨询等领域', '寻找能够实现个人价值的工作', '发挥你的创造力和同理心']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个真诚、理想主义、有深度的朋友和伴侣。',
        tips: ['学会在关系中保持平衡', '与能够理解你理想的人建立联系', '保持开放和诚实的沟通']
      }
    },
    INTP: {
      strengths: {
        title: '核心优势',
        description: '你是一个理性、好奇、善于分析的人，喜欢探索知识和逻辑。',
        tips: ['充分发挥你的分析能力', '利用你的好奇心', '在团队中担任思考者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于理性而忽视情感因素，对细节过于关注，有时会显得过于冷漠。',
        tips: ['学会考虑他人的感受', '关注整体而非仅细节', '培养社交技能']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过独立思考和逻辑分析来学习，注重理论和概念。',
        tips: ['探索抽象概念和理论', '通过问题解决学习', '与其他思考者讨论']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要逻辑分析、创新和解决复杂问题的职业。',
        tips: ['考虑科技、研究、学术等领域', '寻找能够独立思考的环境', '发挥你的分析和创新能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个理性、好奇、有深度的朋友和伴侣。',
        tips: ['学会表达情感', '对他人的感受保持敏感', '在关系中保持开放的沟通']
      }
    },
    ESTP: {
      strengths: {
        title: '核心优势',
        description: '你是一个活跃、冒险、善于应对挑战的人，喜欢行动和体验。',
        tips: ['充分发挥你的行动力', '利用你的适应能力', '在团队中担任行动者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于冲动，对长期规划缺乏兴趣，有时会显得过于冒险。',
        tips: ['学会制定长期目标', '培养耐心', '考虑行动的后果']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过实践和体验来学习，注重实用性和即时反馈。',
        tips: ['参与实际项目', '通过尝试和错误学习', '寻找有挑战性的学习机会']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要行动能力、应对挑战和适应变化的职业。',
        tips: ['考虑销售、体育、应急服务等领域', '寻找能够提供多样性的工作', '发挥你的行动和适应能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个活跃、有趣、善于社交的朋友和伴侣。',
        tips: ['学会在关系中保持承诺', '考虑他人的感受', '在关系中保持平衡']
      }
    },
    ESFP: {
      strengths: {
        title: '核心优势',
        description: '你是一个热情、友好、善于社交的人，享受当下和与他人互动。',
        tips: ['充分发挥你的社交能力', '利用你的热情', '在团队中担任社交者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于关注当下而忽视未来，对冲突感到不适，有时会显得缺乏组织性。',
        tips: ['学会规划未来', '培养应对冲突的能力', '加强组织能力']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过与他人互动和实践来学习，注重趣味性和实用性。',
        tips: ['参与小组活动', '通过游戏和互动学习', '寻找有趣的学习材料']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要社交能力、表达和多样性的职业。',
        tips: ['考虑表演、销售、旅游等领域', '寻找能够与他人互动的工作', '发挥你的社交和表达能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个热情、友好、善于社交的朋友和伴侣。',
        tips: ['学会在关系中保持深度', '考虑他人的感受', '在关系中保持平衡']
      }
    },
    ENFP: {
      strengths: {
        title: '核心优势',
        description: '你是一个充满活力、创意、善于沟通的人，追求可能性和个人成长。',
        tips: ['充分发挥你的创造力', '利用你的沟通能力', '在团队中担任激励者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于理想主义，对细节缺乏关注，有时会显得过于分散精力。',
        tips: ['学会关注细节', '设定明确的目标', '培养专注能力']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过探索和与他人互动来学习，注重意义和可能性。',
        tips: ['探索多种学习资源', '与他人讨论和分享', '将学习与个人兴趣联系']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要创造力、沟通和可能性的职业。',
        tips: ['考虑营销、教育、咨询等领域', '寻找能够提供多样性的工作', '发挥你的创造力和沟通能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个热情、创意、善于沟通的朋友和伴侣。',
        tips: ['学会在关系中保持承诺', '考虑他人的感受', '在关系中保持平衡']
      }
    },
    ENTP: {
      strengths: {
        title: '核心优势',
        description: '你是一个聪明、好奇、善于辩论的人，喜欢挑战传统和探索新想法。',
        tips: ['充分发挥你的创新能力', '利用你的辩论技巧', '在团队中担任创新者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于喜欢辩论而忽视他人感受，对细节缺乏关注，有时会显得过于分散精力。',
        tips: ['学会考虑他人的感受', '关注细节和实施', '培养专注能力']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过辩论和探索来学习，注重概念和可能性。',
        tips: ['参与讨论和辩论', '探索多种观点', '将学习与问题解决联系']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要创新、辩论和解决复杂问题的职业。',
        tips: ['考虑创业、咨询、科技等领域', '寻找能够提供挑战的工作', '发挥你的创新和辩论能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个聪明、好奇、善于辩论的朋友和伴侣。',
        tips: ['学会在关系中保持平衡', '考虑他人的感受', '在关系中保持开放的沟通']
      }
    },
    ESTJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个务实、果断、有组织能力的人，重视效率和秩序。',
        tips: ['充分发挥你的组织能力', '利用你的果断性', '在团队中担任领导者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于注重秩序而忽视灵活性，对他人要求过高，有时会显得过于直接。',
        tips: ['学会灵活应对变化', '考虑他人的感受', '培养耐心']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过结构化和实用性的方式学习，注重效率和结果。',
        tips: ['制定详细的学习计划', '关注实用性和应用', '寻找有明确目标的学习内容']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要组织能力、领导和效率的职业。',
        tips: ['考虑管理、法律、金融等领域', '寻找有明确结构的工作环境', '发挥你的组织和领导能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个务实、果断、有责任感的朋友和伴侣。',
        tips: ['学会表达情感', '考虑他人的感受', '在关系中保持平衡']
      }
    },
    ESFJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个热情、有责任心、善于社交的人，关心他人和团队和谐。',
        tips: ['充分发挥你的社交能力', '利用你的责任感', '在团队中担任协调者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于关注他人需求而忽视自己，对批评敏感，有时会显得过于传统。',
        tips: ['学会照顾自己的需求', '接受建设性批评', '保持开放的心态面对新事物']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过与他人互动和实际应用来学习，注重和谐和实用性。',
        tips: ['参与小组学习', '将学习与帮助他人联系', '寻找有支持性的学习环境']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要社交能力、关怀和组织能力的职业。',
        tips: ['考虑教育、医疗、人力资源等领域', '寻找能够帮助他人的工作', '发挥你的社交和组织能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个热情、有责任心、善于照顾他人的朋友和伴侣。',
        tips: ['学会表达自己的需求', '设定健康的边界', '在关系中保持平衡']
      }
    },
    ENFJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个有领导力、有同理心、善于激励他人的人，追求和谐和个人成长。',
        tips: ['充分发挥你的领导能力', '利用你的同理心', '在团队中担任引导者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于关注他人需求而忽视自己，对批评敏感，有时会显得过于理想主义。',
        tips: ['学会照顾自己的需求', '接受建设性批评', '设定合理的期望']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过与他人互动和意义建构来学习，注重价值观和个人成长。',
        tips: ['参与小组讨论', '将学习与帮助他人联系', '寻找有意义的学习内容']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要领导力、同理心和激励他人的职业。',
        tips: ['考虑教育、咨询、管理等领域', '寻找能够帮助他人成长的工作', '发挥你的领导和同理心']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个有同理心、善于激励、有深度的朋友和伴侣。',
        tips: ['学会在关系中保持平衡', '考虑自己的需求', '在关系中保持开放的沟通']
      }
    },
    ENTJ: {
      strengths: {
        title: '核心优势',
        description: '你是一个自信、果断、有战略思维的人，善于领导和实现目标。',
        tips: ['充分发挥你的领导能力', '利用你的战略思维', '在团队中担任领导者角色']
      },
      weaknesses: {
        title: '潜在挑战',
        description: '你可能过于强势而忽视他人感受，对细节缺乏关注，有时会显得过于自信。',
        tips: ['学会考虑他人的感受', '关注细节和实施', '保持开放的心态接受反馈']
      },
      learningStyle: {
        title: '学习风格',
        description: '你倾向于通过目标导向和战略规划来学习，注重效率和结果。',
        tips: ['设定明确的学习目标', '寻找能够挑战你思维的学习内容', '将学习与实际应用联系']
      },
      careerFit: {
        title: '职业适配',
        description: '你适合需要领导力、战略思维和实现目标的职业。',
        tips: ['考虑管理、创业、咨询等领域', '寻找能够提供挑战的工作', '发挥你的领导和战略能力']
      },
      relationshipStyle: {
        title: '人际关系',
        description: '你是一个自信、果断、有领导力的朋友和伴侣。',
        tips: ['学会表达情感', '考虑他人的感受', '在关系中保持平衡']
      }
    }
  };

  return insights[type] || insights.INTJ; // 默认返回INTJ的分析
}
