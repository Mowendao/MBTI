package com.mbti.admin;

import com.mbti.admin.entity.*;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/test-takers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TestTakerController {

    private final TestTakerRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestTaker>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestTaker>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(repository.findById(id).orElseThrow()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestTaker>> create(@RequestBody TestTaker entity) {
        entity.setId(null);
        return ResponseEntity.ok(ApiResponse.success("创建成功", repository.save(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TestTaker>> update(@PathVariable Long id, @RequestBody TestTaker updated) {
        TestTaker entity = repository.findById(id).orElseThrow();
        if (updated.getName() != null) entity.setName(updated.getName());
        if (updated.getEmail() != null) entity.setEmail(updated.getEmail());
        if (updated.getPhone() != null) entity.setPhone(updated.getPhone());
        if (updated.getDepartment() != null) entity.setDepartment(updated.getDepartment());
        if (updated.getPosition() != null) entity.setPosition(updated.getPosition());
        if (updated.getBatchId() != null) entity.setBatchId(updated.getBatchId());
        if (updated.getBatchName() != null) entity.setBatchName(updated.getBatchName());
        return ResponseEntity.ok(ApiResponse.success("更新成功", repository.save(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
