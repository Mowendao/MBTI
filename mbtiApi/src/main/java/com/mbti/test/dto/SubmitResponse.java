package com.mbti.test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitResponse {
    private Long resultId;
    private String mbtiType;
    private String date;
    private Map<String, Integer> scores;
    private Map<String, Double> percentage;
}
