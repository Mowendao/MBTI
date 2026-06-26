package com.mbti.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_assessment_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAssessmentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 20)
    private String color;

    @Column(name = "sys_prompt", columnDefinition = "TEXT")
    private String sysPrompt;

    @Column(name = "opening_line", columnDefinition = "TEXT")
    private String openingLine;

    @Column(name = "result_parse_rule", length = 50)
    @Builder.Default
    private String resultParseRule = "plain_text";

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
