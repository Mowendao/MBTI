package com.mbti.admin.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestScheduleRepository extends JpaRepository<TestSchedule, Long> {}
