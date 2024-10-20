export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    priority: Priority;
    status: Status;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
}