package com.hacisimsek.task_management.dto;

import com.hacisimsek.task_management.model.Priority;
import com.hacisimsek.task_management.model.Status;
import lombok.Data;

@Data
public class TaskDto {
    private String title;
    private String description;
    private Priority priority;
    private Status status;
}
