import axios from 'axios';
import { Task, CreateTaskDto } from '../types/task';

const API_URL = 'http://localhost:8080/api/tasks';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const TaskService = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await api.get<Task[]>('');
        return response.data;
    },

    getTaskById: async (id: number): Promise<Task> => {
        const response = await api.get<Task>(`/${id}`);
        return response.data;
    },

    createTask: async (task: CreateTaskDto): Promise<Task> => {
        const response = await api.post<Task>('', task);
        return response.data;
    },

    updateTask: async (id: number, task: CreateTaskDto): Promise<Task> => {
        const response = await api.put<Task>(`/${id}`, task);
        return response.data;
    },

    deleteTask: async (id: number): Promise<void> => {
        await api.delete(`/${id}`);
    },

    getTasksByStatus: async (status: string): Promise<Task[]> => {
        const response = await api.get<Task[]>(`/status/${status}`);
        return response.data;
    },
};