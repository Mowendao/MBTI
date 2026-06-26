package com.mbti.admin;

import com.mbti.admin.entity.*;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/assessment-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AssessmentTypeController {

    private final AssessmentTypeRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssessmentType>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentType>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(repository.findById(id).orElseThrow()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssessmentType>> create(@RequestBody AssessmentType entity) {
        entity.setId(null);
        return ResponseEntity.ok(ApiResponse.success("创建成功", repository.save(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentType>> update(@PathVariable Long id, @RequestBody AssessmentType updated) {
        AssessmentType entity = repository.findById(id).orElseThrow();
        if (updated.getName() != null) entity.setName(updated.getName());
        if (updated.getDescription() != null) entity.setDescription(updated.getDescription());
        entity.setActive(updated.isActive());
        return ResponseEntity.ok(ApiResponse.success("更新成功", repository.save(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
