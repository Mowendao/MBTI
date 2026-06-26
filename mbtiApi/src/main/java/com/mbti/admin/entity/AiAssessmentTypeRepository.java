package com.mbti.admin.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiAssessmentTypeRepository extends JpaRepository<AiAssessmentType, Long> {
    List<AiAssessmentType> findByActiveTrueOrderBySortOrderAsc();
    Optional<AiAssessmentType> findByCode(String code);
}
