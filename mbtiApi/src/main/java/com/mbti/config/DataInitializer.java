package com.mbti.config;

import com.mbti.admin.entity.*;
import com.mbti.career.Career;
import com.mbti.career.CareerRepository;
import com.mbti.question.Question;
import com.mbti.question.QuestionOption;
import com.mbti.question.QuestionRepository;
import com.mbti.user.User;
import com.mbti.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AssessmentTypeRepository assessmentTypeRepository;
    private final PersonalityDimensionRepository dimensionRepository;
    private final CareerRepository careerRepository;
    private final BatchRepository batchRepository;
    private final AiAssessmentTypeRepository aiAssessmentTypeRepository;

    @Override
    public void run(String... args) {
        // Only seed if no admin exists
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            initUsers();
            initQuestions();
            initDimensions();
            initAssessmentTypes();
            initCareers();
            initBatches();
        }
        // Always try to seed AI assessment types if empty
        if (aiAssessmentTypeRepository.count() == 0) {
            initAiAssessmentTypes();
        }
    }

    private void initUsers() {
        User admin = User.builder()
                .name("管理员")
                .email("admin@example.com")
                .password(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(admin);
    }

    private void initQuestions() {
        List<Question> questions = List.of(
            createQuestion("在社交场合中，你通常：", "EI",
                "喜欢主动与人交谈，结交新朋友", 1,
                "更倾向于与熟人交流，需要时间热身", 7),
            createQuestion("当你需要充电时，你更倾向于：", "EI",
                "和朋友一起出去活动", 1,
                "独自待着看书或休息", 7),
            createQuestion("在工作中，你更喜欢：", "EI",
                "团队合作，头脑风暴", 1,
                "独立完成任务", 7),
            createQuestion("周末你更愿意：", "EI",
                "参加聚会或社交活动", 1,
                "在家享受独处时光", 7),
            createQuestion("你觉得自己更偏向：", "EI",
                "热情外向，喜欢表达", 1,
                "含蓄内敛，善于倾听", 7),

            createQuestion("当你学习新事物时，你更关注：", "SN",
                "具体的事实和实际应用", 1,
                "背后的原理和可能性", 7),
            createQuestion("你更喜欢哪种描述方式：", "SN",
                "详细的、具体的说明", 1,
                "概括性的、概念性的描述", 7),
            createQuestion("阅读时你更偏好：", "SN",
                "纪实类、实践指南", 1,
                "科幻类、理论探讨", 7),
            createQuestion("做决定时你更依赖：", "SN",
                "过去的经验和已知事实", 1,
                "直觉和未来的可能性", 7),
            createQuestion("你更欣赏哪种人：", "SN",
                "脚踏实地、注重细节的人", 1,
                "富有想象力、有远见的人", 7),

            createQuestion("做重要决定时，你更看重：", "TF",
                "逻辑分析和客观事实", 1,
                "个人感受和他人感受", 7),
            createQuestion("当朋友遇到困难，你通常会：", "TF",
                "帮ta分析问题，找出解决方案", 1,
                "先给予情感支持和安慰", 7),
            createQuestion("在讨论中，你更在意：", "TF",
                "事情的对错和公平性", 1,
                "大家的感受和团队氛围", 7),
            createQuestion("你觉得自己更偏向：", "TF",
                "理性客观，就事论事", 1,
                "感性体贴，善解人意", 7),
            createQuestion("评价一件事时，你更关注：", "TF",
                "它是否合理有效", 1,
                "它是否让人舒服", 7),

            createQuestion("你的生活方式更接近：", "JP",
                "计划周详，按部就班", 1,
                "随性灵活，随机应变", 7),
            createQuestion("对于旅游，你更喜欢：", "JP",
                "详细的行程计划", 1,
                "走到哪玩到哪的自由行", 7),
            createQuestion("你的工作环境通常是：", "JP",
                "整洁有序，物品归位", 1,
                "看似杂乱但自己知道在哪", 7),
            createQuestion("面对截止日期，你通常：", "JP",
                "提前规划，尽早完成", 1,
                "最后关头效率最高", 7),
            createQuestion("你更认同哪种说法：", "JP",
                "有规律的生活让人安心", 1,
                "生活需要惊喜和变化", 7)
        );

        questionRepository.saveAll(questions);
    }

    private Question createQuestion(String text, String dimension,
                                     String opt1Text, int opt1Value,
                                     String opt2Text, int opt2Value) {
        Question q = Question.builder()
                .text(text)
                .dimension(dimension)
                .build();

        QuestionOption opt1 = QuestionOption.builder()
                .text(opt1Text)
                .value(opt1Value)
                .question(q)
                .build();

        QuestionOption opt2 = QuestionOption.builder()
                .text(opt2Text)
                .value(opt2Value)
                .question(q)
                .build();

        q.setOptions(List.of(opt1, opt2));
        return q;
    }

    private void initDimensions() {
        List<PersonalityDimension> dims = List.of(
            PersonalityDimension.builder().code("E").name("外倾").description("倾向于从外部世界获取能量").category("EI").build(),
            PersonalityDimension.builder().code("I").name("内倾").description("倾向于从内部世界获取能量").category("EI").build(),
            PersonalityDimension.builder().code("S").name("感觉").description("关注具体事实和细节").category("SN").build(),
            PersonalityDimension.builder().code("N").name("直觉").description("关注抽象概念和可能性").category("SN").build(),
            PersonalityDimension.builder().code("T").name("思考").description("基于逻辑和客观分析做决策").category("TF").build(),
            PersonalityDimension.builder().code("F").name("情感").description("基于价值观和个人感受做决策").category("TF").build(),
            PersonalityDimension.builder().code("J").name("判断").description("喜欢有计划有条理的生活方式").category("JP").build(),
            PersonalityDimension.builder().code("P").name("感知").description("喜欢灵活随性的生活方式").category("JP").build()
        );
        dimensionRepository.saveAll(dims);
    }

    private void initAssessmentTypes() {
        List<AssessmentType> types = List.of(
            AssessmentType.builder().name("MBTI性格测试").description("迈尔斯-布里格斯性格类型测试，评估16种人格类型").active(true).build(),
            AssessmentType.builder().name("职业兴趣测试").description("霍兰德职业兴趣测试，评估职业倾向").active(true).build()
        );
        assessmentTypeRepository.saveAll(types);
    }

    private void initCareers() {
        List<Career> careers = List.of(
            Career.builder().name("软件工程师").description("负责设计、开发和维护软件系统，需要较强的逻辑思维和问题解决能力").suitableTypes("INTJ,INTP,ISTJ,ENTJ").skills("编程,算法,系统设计,问题解决").education("计算机科学或相关专业本科以上").build(),
            Career.builder().name("心理咨询师").description("帮助来访者解决心理问题，提供情感支持和专业指导").suitableTypes("INFJ,ENFJ,ISFJ,INFP").skills("倾听,共情,沟通,心理评估").education("心理学硕士以上，需执业资格证书").build(),
            Career.builder().name("项目经理").description("统筹项目资源，协调团队合作，确保项目按时保质交付").suitableTypes("ESTJ,ENTJ,ESFJ,ENFJ").skills("领导力,沟通,计划,风险管理").education("管理类或相关专业本科以上").build(),
            Career.builder().name("艺术家/设计师").description("通过视觉或表演艺术表达创意和想法").suitableTypes("ISFP,INFP,ENFP,ESFP").skills("创意,审美,表达能力,色彩感知").education("艺术或设计类专业").build(),
            Career.builder().name("数据分析师").description("收集和分析数据，提供业务洞察和决策支持").suitableTypes("ISTJ,INTJ,ISTP,ENTJ").skills("数据分析,统计学,SQL,可视化").education("数学/统计学/计算机相关专业").build(),
            Career.builder().name("市场营销经理").description("制定市场策略，推广产品或服务，分析市场趋势").suitableTypes("ENTP,ENFP,ESTP,ESFJ").skills("沟通,创意,市场分析,策划").education("市场营销或商科专业").build(),
            Career.builder().name("医生").description("诊断和治疗疾病，关注患者健康").suitableTypes("ISTJ,ESTJ,ISFJ,ESFJ").skills("细致,责任心,医学知识,沟通").education("医学专业本科以上，需执业医师证").build(),
            Career.builder().name("作家/编辑").description("创作和编辑文字内容，传递信息和思想").suitableTypes("INFP,INFJ,ENFP,ISFP").skills("写作,编辑,研究,创造力").education("文学/新闻或相关专业").build(),
            Career.builder().name("企业管理者").description("领导组织运营，制定战略方向，管理团队").suitableTypes("ENTJ,ESTJ,ENFJ,INTJ").skills("领导力,决策,战略思维,沟通").education("MBA或相关管理专业").build(),
            Career.builder().name("科研人员").description("从事科学研究，探索未知领域，推动技术进步").suitableTypes("INTJ,INTP,ISTJ,ENTP").skills("研究,分析,实验设计,论文写作").education("硕士或博士学历").build()
        );
        careerRepository.saveAll(careers);
    }

    private void initBatches() {
        List<Batch> batches = List.of(
            Batch.builder().name("2026年第一批次").description("2026年第一季度测试批次")
                    .startDate(java.time.LocalDate.of(2026, 1, 1))
                    .endDate(java.time.LocalDate.of(2026, 3, 31))
                    .active(true).build(),
            Batch.builder().name("2026年第二批次").description("2026年第二季度测试批次")
                    .startDate(java.time.LocalDate.of(2026, 4, 1))
                    .endDate(java.time.LocalDate.of(2026, 6, 30))
                    .active(true).build()
        );
        batchRepository.saveAll(batches);
    }

    private void initAiAssessmentTypes() {
        List<AiAssessmentType> types = List.of(
            AiAssessmentType.builder()
                .code("mbti").name("MBTI 性格评估").icon("🧠")
                .description("经典 MBTI 人格类型测试，评估你在精力来源、认知方式、决策方式和生活方式四个维度的倾向")
                .color("#667eea").sortOrder(1).resultParseRule("mbti_4letter")
                .sysPrompt("你是一位温暖、敏锐的 MBTI 人格评估专家。你通过自然对话来识别用户的人格类型，而不是让用户做固定题目。\n\n任务：通过6-10轮对话，自然地了解用户，推断他们的MBTI类型。\n\n对话策略：\n- 每次只问1个问题，要生活化场景化\n- 覆盖四个维度：E/I(精力来源)、S/N(认知方式)、T/F(决策方式)、J/P(生活方式)\n- 根据回答调整追问，确定某维度后转向下一个\n\n输出格式：\n每轮末尾加上分析注释：（当前判断：E/I=60%外向… 信心度：40%，还需了解：…）\n当信心度达80%以上，给出最终结论：（最终判断：你的MBTI类型是ENFP「激励者」）\n然后热情宣布结果。\n\n重要原则：\n- 语气温暖好奇真诚，全中文\n- 不要同时问多个问题\n- 不要告诉用户在分析，保持自然对话感")
                .openingLine("你好呀！很高兴认识你！✨\n\n为了帮你发现你的 MBTI 人格类型，我们先从一个小话题开始吧——\n\n**周末的时候，你更喜欢怎么度过？是约上朋友出去聚会，还是一个人待在家里做自己喜欢的事？** 🏠🎉")
                .build(),

            AiAssessmentType.builder()
                .code("bigfive").name("大五人格评估").icon("📊")
                .description("大五人格模型，从开放性、尽责性、外向性、宜人性、情绪稳定性五个维度全面了解你的性格")
                .color("#E91E8A").sortOrder(2).resultParseRule("plain_text")
                .sysPrompt("你是一位温暖、专业的大五人格评估专家。你通过自然对话来识别用户的大五人格特质。\n\n任务：通过8-12轮对话了解用户在大五人格五个维度上的倾向。\n\n五个维度：\n1. 开放性(Openness)：好奇心、创造力、对新事物的态度\n2. 尽责性(Conscientiousness)：条理性、自律性、责任感\n3. 外向性(Extraversion)：社交能量、活跃度、热情\n4. 宜人性(Agreeableness)：同理心、合作性、信任倾向\n5. 神经质(Neuroticism)：情绪敏感性、压力反应、稳定性\n\n每轮末尾括号标注分析，最终给出完整五维评分。全中文，自然对话。")
                .openingLine("你好！很高兴和你聊聊！😊\n\n让我来了解你的性格特质。先从一个小问题开始——\n\n**如果有一个完全空闲的周末，你更倾向于尝试一项全新的活动（比如学一门新手艺），还是按照熟悉的节奏休息放松？** 🌟")
                .build(),

            AiAssessmentType.builder()
                .code("enneagram").name("九型人格评估").icon("🎭")
                .description("古老的九型人格智慧，通过对话发现你的核心人格类型——你是完美者、助人者还是成就者？")
                .color("#e67e22").sortOrder(3).resultParseRule("plain_text")
                .sysPrompt("你是一位精通九型人格的智慧导师。你通过自然对话来判断用户属于九型人格中的哪一种。\n\n九型人格：\n1号完美者、2号助人者、3号成就者、4号独特者、5号探索者、6号忠诚者、7号活跃者、8号挑战者、9号平和者\n\n对话策略：通过8-10轮自然对话，每次问1个生活化问题。根据回答分析用户的核心恐惧、欲望和动机，逐步缩小范围。\n\n每轮末尾用括号标注分析：（当前判断：倾向于2号助人者，可能性55%，还需确认：是否害怕不被需要）\n当判断明确时给出最终结论：（最终判断：你的九型人格是4号独特者）\n\n语气温暖智慧，像一位禅师。全中文。")
                .openingLine("你好，欢迎来到九型人格的探索之旅 🎭\n\n我是你的九型向导。我们先从一个小问题开始——\n\n**当你完成一件重要的事情时，你更在意的是什么？是结果是否完美，还是别人是否满意，或者是你自己是否从中获得了成长？**")
                .build(),

            AiAssessmentType.builder()
                .code("disc").name("DISC 性格评估").icon("📋")
                .description("DISC 行为风格测评，了解你是支配型、影响型、稳健型还是服从型，以及你的行为风格密码")
                .color("#3498db").sortOrder(4).resultParseRule("plain_text")
                .sysPrompt("你是一位专业的 DISC 行为风格分析师。你通过自然对话来判断用户的 DISC 类型。\n\n四种类型：\nD 支配型(Dominance)：直接、果断、好胜，关注结果\nI 影响型(Influence)：热情、乐观、善于社交，关注人际\nS 稳健型(Steadiness)：温和、耐心、可靠，关注稳定\nC 服从型(Compliance)：精准、逻辑、谨慎，关注规则\n\n通过6-8轮自然对话，观察用户面对挑战、与人相处、工作节奏等方面的倾向来判定。\n\n每轮用括号标注分析。最终给出类型+建议。语气像职场教练，干脆有洞察力。全中文。")
                .openingLine("你好！让我来解码你的行为风格密码 📋\n\n首先问问你——\n\n**当你面对一个全新的挑战或项目时，你的第一反应是什么？是立刻冲上去大干一场，还是先仔细分析再做计划？** 💪")
                .build(),

            AiAssessmentType.builder()
                .code("holland").name("霍兰德职业评估").icon("🧭")
                .description("霍兰德职业兴趣测试，探索你的职业兴趣代码——你是现实型、研究型、艺术型、社会型、企业型还是常规型？")
                .color("#2ecc71").sortOrder(5).resultParseRule("plain_text")
                .sysPrompt("你是一位温暖的职业规划导师。你通过自然对话来判断用户的霍兰德职业兴趣代码。\n\n六种类型：\nR 现实型(Realistic)：动手操作、机械制造\nI 研究型(Investigative)：思考探索、分析研究\nA 艺术型(Artistic)：创意表达、自我展现\nS 社会型(Social)：帮助他人、教育服务\nE 企业型(Enterprising)：领导管理、商业决策\nC 常规型(Conventional)：整理归类、流程规范\n\n通过6-8轮对话，从日常偏好、工作倾向、兴趣活动等方面了解用户。\n\n每轮括号标注分析。最终给出霍兰德三码(如RIA)和推荐职业方向。语气像职业导师。全中文。")
                .openingLine("你好！让我帮你探索职业兴趣的方向 🧭\n\n先来一个小问题——\n\n**如果让你参加一个周末工作坊，以下哪个最吸引你？\nA) 动手做木工或修理东西 🔧\nB) 参加一场头脑风暴讨论会 💡\nC) 画一幅画或写一首诗 🎨**")
                .build(),

            AiAssessmentType.builder()
                .code("temper").name("气质类型评估").icon("🔥")
                .description("古老的四种气质学说——你是热情似火的胆汁质、灵活多变的的多血质、沉稳内敛的粘液质还是细腻敏感的抑郁质？")
                .color("#e74c3c").sortOrder(6).resultParseRule("plain_text")
                .sysPrompt("你是一位通达人性、学贯中西的气质类型分析师。你通过自然对话来判断用户属于哪种传统气质类型。\n\n四种气质：\n🔥 胆汁质(Choleric)：热情冲动、精力旺盛、行动力强\n💧 多血质(Sanguine)：活泼开朗、善于社交、兴趣广泛\n🌊 粘液质(Phlegmatic)：沉稳冷静、耐心坚韧、有条不紊\n🌫️ 抑郁质(Melancholic)：细腻敏感、深思熟虑、完美主义\n\n通过6-8轮对话，从情绪反应、行动速度、社交方式等方面判断。\n\n每轮括号标注分析。最终确定主要气质+辅助气质，并给出生活建议。语气像一位阅历丰富的老者，温暖有智慧。全中文。")
                .openingLine("年轻人，来坐坐。让我看看你的气质底色 🔥\n\n我先问你一个问题——\n\n**当遇到一件让你特别生气的事情时，你的反应更接近于哪一种？\nA) 当场爆发，说完就完事 🔥\nB) 当场不说，但心里记很久 🌊\nC) 冷静分析，想办法解决 🌱**")
                .build()
        );
        aiAssessmentTypeRepository.saveAll(types);
    }
}
