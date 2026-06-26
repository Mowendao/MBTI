package com.mbti.career;

import com.mbti.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Career>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(careerService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Career>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(careerService.getById(id)));
    }

    @GetMapping("/recommend")
    public ResponseEntity<ApiResponse<List<Career>>> recommend(@RequestParam String type) {
        return ResponseEntity.ok(ApiResponse.success(careerService.recommend(type)));
    }
}
