import { Task, CreateTaskDto } from '../types/task';

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    return fetch('/api/tasks').then(res => res.json());
  }

  static async getTasksByStatus(status: string): Promise<Task[]> {
    return fetch(`/api/tasks?status=${status}`).then(res => res.json());
  }

  static async createTask(newTask: CreateTaskDto): Promise<Task> {
    return fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    }).then(res => res.json());
  }

  static async updateTask(id: number, updatedTask: CreateTaskDto): Promise<Task> {
    return fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    }).then(res => res.json());
  }

  static async deleteTask(id: number): Promise<void> {
    return fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    }).then(res => res.json());
  }
}
