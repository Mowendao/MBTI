package com.mbti.admin;

import com.mbti.admin.entity.*;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/schedules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TestScheduleController {

    private final TestScheduleRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestSchedule>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestSchedule>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(repository.findById(id).orElseThrow()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestSchedule>> create(@RequestBody TestSchedule entity) {
        entity.setId(null);
        return ResponseEntity.ok(ApiResponse.success("创建成功", repository.save(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TestSchedule>> update(@PathVariable Long id, @RequestBody TestSchedule updated) {
        TestSchedule entity = repository.findById(id).orElseThrow();
        if (updated.getBatchId() != null) entity.setBatchId(updated.getBatchId());
        if (updated.getBatchName() != null) entity.setBatchName(updated.getBatchName());
        if (updated.getAssessmentTypeId() != null) entity.setAssessmentTypeId(updated.getAssessmentTypeId());
        if (updated.getAssessmentTypeName() != null) entity.setAssessmentTypeName(updated.getAssessmentTypeName());
        if (updated.getStartTime() != null) entity.setStartTime(updated.getStartTime());
        if (updated.getEndTime() != null) entity.setEndTime(updated.getEndTime());
        if (updated.getLocation() != null) entity.setLocation(updated.getLocation());
        entity.setActive(updated.isActive());
        return ResponseEntity.ok(ApiResponse.success("更新成功", repository.save(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
