package com.mbti.admin;

import com.mbti.admin.entity.*;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dimensions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PersonalityDimensionController {

    private final PersonalityDimensionRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PersonalityDimension>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonalityDimension>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(repository.findById(id).orElseThrow()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PersonalityDimension>> create(@RequestBody PersonalityDimension entity) {
        entity.setId(null);
        return ResponseEntity.ok(ApiResponse.success("创建成功", repository.save(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonalityDimension>> update(@PathVariable Long id, @RequestBody PersonalityDimension updated) {
        PersonalityDimension entity = repository.findById(id).orElseThrow();
        if (updated.getCode() != null) entity.setCode(updated.getCode());
        if (updated.getName() != null) entity.setName(updated.getName());
        if (updated.getDescription() != null) entity.setDescription(updated.getDescription());
        if (updated.getCategory() != null) entity.setCategory(updated.getCategory());
        return ResponseEntity.ok(ApiResponse.success("更新成功", repository.save(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
