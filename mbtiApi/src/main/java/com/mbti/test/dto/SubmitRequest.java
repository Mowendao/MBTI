package com.mbti.test.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SubmitRequest {
    private List<AnswerDTO> answers;

    @Data
    public static class AnswerDTO {
        private Long questionId;
        private Integer value; // 1-7
    }
}
