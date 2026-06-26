package com.mbti.admin;

import com.mbti.admin.entity.*;
import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analysis")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalysisController {

    private final AdminTestResultRepository adminTestResultRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        List<AdminTestResult> results = adminTestResultRepository.findAll();

        Map<String, Long> typeCount = results.stream()
                .filter(r -> r.getPersonalityType() != null)
                .collect(Collectors.groupingBy(
                        AdminTestResult::getPersonalityType,
                        Collectors.counting()
                ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", results.size());
        stats.put("completed", adminTestResultRepository.countByCompleted(true));
        stats.put("typeDistribution", typeCount);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<AdminTestResult>>> getResults() {
        return ResponseEntity.ok(ApiResponse.success(adminTestResultRepository.findAll()));
    }
}
