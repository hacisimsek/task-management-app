package com.hacisimsek.task_management.repository;

import com.hacisimsek.task_management.model.Status;
import com.hacisimsek.task_management.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCompletedOrderByCreatedAtDesc(boolean completed);
    List<Task> findByStatusOrderByCreatedAtDesc(Status status);
}
