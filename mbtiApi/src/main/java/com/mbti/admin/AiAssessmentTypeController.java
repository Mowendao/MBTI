package com.mbti.admin;

import com.mbti.admin.entity.AiAssessmentType;
import com.mbti.admin.entity.AiAssessmentTypeRepository;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ai-assessment-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AiAssessmentTypeController {

    private final AiAssessmentTypeRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AiAssessmentType>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AiAssessmentType>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(repository.findById(id).orElseThrow()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AiAssessmentType>> create(@RequestBody AiAssessmentType entity) {
        entity.setId(null);
        return ResponseEntity.ok(ApiResponse.success("创建成功", repository.save(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AiAssessmentType>> update(@PathVariable Long id, @RequestBody AiAssessmentType updated) {
        AiAssessmentType entity = repository.findById(id).orElseThrow();
        if (updated.getCode() != null) entity.setCode(updated.getCode());
        if (updated.getName() != null) entity.setName(updated.getName());
        if (updated.getIcon() != null) entity.setIcon(updated.getIcon());
        if (updated.getDescription() != null) entity.setDescription(updated.getDescription());
        if (updated.getColor() != null) entity.setColor(updated.getColor());
        if (updated.getSysPrompt() != null) entity.setSysPrompt(updated.getSysPrompt());
        if (updated.getOpeningLine() != null) entity.setOpeningLine(updated.getOpeningLine());
        if (updated.getResultParseRule() != null) entity.setResultParseRule(updated.getResultParseRule());
        if (updated.getSortOrder() != null) entity.setSortOrder(updated.getSortOrder());
        entity.setActive(updated.isActive());
        return ResponseEntity.ok(ApiResponse.success("更新成功", repository.save(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
