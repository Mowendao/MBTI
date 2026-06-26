package com.mbti.admin;

import com.mbti.admin.entity.AiAssessmentType;
import com.mbti.admin.entity.AiAssessmentTypeRepository;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai-assessment-types")
@RequiredArgsConstructor
public class AiAssessmentPublicController {

    private final AiAssessmentTypeRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AiAssessmentType>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(repository.findByActiveTrueOrderBySortOrderAsc()));
    }
}
