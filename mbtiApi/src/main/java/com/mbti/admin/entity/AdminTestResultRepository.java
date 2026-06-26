package com.mbti.admin.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminTestResultRepository extends JpaRepository<AdminTestResult, Long> {
    long countByCompleted(boolean completed);
}
