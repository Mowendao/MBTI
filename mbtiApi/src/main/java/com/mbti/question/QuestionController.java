package com.mbti.question;

import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Question>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(questionService.getAllQuestions()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Question>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(questionService.getById(id)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(questionService.getStats()));
    }
}
