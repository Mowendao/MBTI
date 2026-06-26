package com.mbti.test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mbti.question.Question;
import com.mbti.question.QuestionRepository;
import com.mbti.test.dto.SubmitRequest;
import com.mbti.test.dto.SubmitResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final QuestionRepository questionRepository;
    private final TestResultRepository testResultRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public SubmitResponse submitTest(Long userId, SubmitRequest request) {
        List<Question> questions = questionRepository.findAllByOrderByIdAsc();
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        // Calculate scores per dimension
        Map<String, Integer> scores = new HashMap<>();
        scores.put("EI", 0);
        scores.put("SN", 0);
        scores.put("TF", 0);
        scores.put("JP", 0);

        for (SubmitRequest.AnswerDTO answer : request.getAnswers()) {
            Question q = questionMap.get(answer.getQuestionId());
            if (q == null) continue;

            // value 1-7, offset by -4 to get range -3 to +3
            int score = answer.getValue() - 4;
            scores.merge(q.getDimension(), score, Integer::sum);
        }

        // Determine MBTI type
        String mbtiType = "";
        mbtiType += scores.get("EI") > 0 ? "E" : "I";
        mbtiType += scores.get("SN") > 0 ? "S" : "N";
        mbtiType += scores.get("TF") > 0 ? "T" : "F";
        mbtiType += scores.get("JP") > 0 ? "J" : "P";

        // Calculate percentages (max possible per dimension = 5 questions * 3 = 15)
        Map<String, Double> percentage = new HashMap<>();
        String[] dims = {"EI", "SN", "TF", "JP"};
        String[][] poles = {{"E", "I"}, {"S", "N"}, {"T", "F"}, {"J", "P"}};

        for (int i = 0; i < dims.length; i++) {
            int score = scores.get(dims[i]);
            double absScore = Math.abs(score);
            double pct = Math.min(absScore / 15.0 * 100, 100);
            percentage.put(poles[i][0], score > 0 ? pct : 100 - pct);
            percentage.put(poles[i][1], score > 0 ? 100 - pct : pct);
        }

        // Save to database
        TestResult result = TestResult.builder()
                .userId(userId)
                .mbtiType(mbtiType)
                .scoresJson(toJson(scores))
                .percentageJson(toJson(percentage))
                .build();

        testResultRepository.save(result);

        return SubmitResponse.builder()
                .resultId(result.getId())
                .mbtiType(mbtiType)
                .date(result.getCreatedAt().toString())
                .scores(scores)
                .percentage(percentage)
                .build();
    }

    public List<TestResult> getHistory(Long userId) {
        return testResultRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public TestResult getResult(Long id) {
        return testResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("测试结果不存在"));
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }
}
