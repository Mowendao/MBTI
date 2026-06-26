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
}
