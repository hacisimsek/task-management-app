'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Alert from '@/components/ui/alert';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

const TaskManagement = () => {
  interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setTasks(data);
    } catch {
      setError('Tasks yüklenirken bir hata oluştu.');
    }
  };

  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
    } catch {
      setError('Task eklenirken bir hata oluştu.');
    }
  };

  const updateTask = async (id: number, updatedTask: Task) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      setTasks(tasks.map((task) => (task.id === id ? data : task)));
    } catch {
      setError('Task güncellenirken bir hata oluştu.');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive">{error}</Alert>
      )}

      <form onSubmit={addTask} className="space-y-4 mb-6">
        <Input
          placeholder="Task başlığı..."
          value={newTask.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Input
          placeholder="Açıklama..."
          value={newTask.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <div className="flex gap-4">
          <Select
            value={newTask.priority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="LOW">Düşük</option>
            <option value="MEDIUM">Orta</option>
            <option value="HIGH">Yüksek</option>
          </Select>
          <Select
            value={newTask.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="TODO">Yapılacak</option>
            <option value="IN_PROGRESS">Devam Ediyor</option>
            <option value="DONE">Tamamlandı</option>
          </Select>
        </div>
        <Button onClick={addTask}>
          <PlusCircle className="w-5 h-5 mr-2" />
            Task Ekle
        </Button>
      </form>

      
      {tasks.map((task) => (
        <div key={task.id} className="bg-white shadow-md p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p className="text-sm text-gray-700">{task.description}</p>
          <div className="flex justify-between mt-4">
            <span className="text-sm text-gray-600">Öncelik: {task.priority}</span>
            <span className="text-sm text-gray-600">Durum: {task.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskManagement;
