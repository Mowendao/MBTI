package com.mbti.test;

import com.mbti.common.ApiResponse;
import com.mbti.test.dto.SubmitRequest;
import com.mbti.test.dto.SubmitResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<SubmitResponse>> submit(@AuthenticationPrincipal Long userId,
                                                              @RequestBody SubmitRequest request) {
        SubmitResponse response = testService.submitTest(userId, request);
        return ResponseEntity.ok(ApiResponse.success("测试完成", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<TestResult>>> history(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.success(testService.getHistory(userId)));
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<ApiResponse<TestResult>> getResult(@AuthenticationPrincipal Long userId,
                                                             @PathVariable Long id) {
        TestResult result = testService.getResult(id);
        if (!result.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(ApiResponse.forbidden("无权访问"));
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
