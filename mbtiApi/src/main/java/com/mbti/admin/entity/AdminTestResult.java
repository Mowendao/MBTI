package com.mbti.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminTestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_taker_id")
    private Long testTakerId;

    private String testTakerName;

    @Column(name = "test_schedule_id")
    private Long testScheduleId;

    private String testScheduleName;

    @Column(name = "personality_type", length = 10)
    private String personalityType;

    @Column(columnDefinition = "TEXT")
    private String scoresJson;

    @Column(name = "percentage_json", columnDefinition = "TEXT")
    private String percentageJson;

    @Column(columnDefinition = "TEXT")
    private String analysis;

    @Column(name = "career_recommendation", columnDefinition = "TEXT")
    private String careerRecommendation;

    @Builder.Default
    private boolean completed = false;

    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
