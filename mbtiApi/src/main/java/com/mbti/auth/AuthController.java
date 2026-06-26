package com.mbti.auth;

import com.mbti.auth.dto.AuthResponse;
import com.mbti.auth.dto.LoginRequest;
import com.mbti.auth.dto.RegisterRequest;
import com.mbti.common.ApiResponse;
import com.mbti.user.User;
import com.mbti.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request.getEmail(), request.getPassword(), request.getName());
        return ResponseEntity.ok(ApiResponse.success("注册成功", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.success("登录成功", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> me(@AuthenticationPrincipal Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        // 不返回密码
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@AuthenticationPrincipal Long userId,
                                                            @RequestBody User updated) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        if (updated.getName() != null) user.setName(updated.getName());
        if (updated.getPhone() != null) user.setPhone(updated.getPhone());
        if (updated.getDepartment() != null) user.setDepartment(updated.getDepartment());
        if (updated.getPosition() != null) user.setPosition(updated.getPosition());
        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("更新成功", user));
    }
}
