package com.hacisimsek.task_management.service;

import com.hacisimsek.task_management.dto.TaskDto;
import com.hacisimsek.task_management.exception.TaskNotFoundException;
import com.hacisimsek.task_management.model.Status;
import com.hacisimsek.task_management.model.Task;
import com.hacisimsek.task_management.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));
    }

    public Task createTask(TaskDto taskDto) {
        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .priority(taskDto.getPriority())
                .status(taskDto.getStatus())
                .build();
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskDto taskDto) {
        Task task = getTaskById(id);
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setPriority(taskDto.getPriority());
        task.setStatus(taskDto.getStatus());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    public List<Task> getCompletedTasks() {
        return taskRepository.findByCompletedOrderByCreatedAtDesc(true);
    }

    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatusOrderByCreatedAtDesc(status);
    }
}