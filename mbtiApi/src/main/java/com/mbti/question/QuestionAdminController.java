package com.mbti.question;

import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class QuestionAdminController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<ApiResponse<Question>> create(@RequestBody Question question) {
        return ResponseEntity.ok(ApiResponse.success("创建成功", questionService.create(question)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Question>> update(@PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(ApiResponse.success("更新成功", questionService.update(id, question)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        questionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
