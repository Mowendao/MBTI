package com.mbti.career;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {

    private final CareerRepository careerRepository;

    public List<Career> getAll() {
        return careerRepository.findAll();
    }

    public Career getById(Long id) {
        return careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("职业不存在"));
    }

    public List<Career> recommend(String mbtiType) {
        // Find careers that contain at least one matching type
        return careerRepository.findAll().stream()
                .filter(c -> {
                    String[] types = c.getSuitableTypes().split(",");
                    for (String t : types) {
                        if (t.trim().equalsIgnoreCase(mbtiType)) return true;
                    }
                    return false;
                })
                .toList();
    }
}
