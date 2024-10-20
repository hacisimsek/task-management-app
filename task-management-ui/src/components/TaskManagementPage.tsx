import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Task, CreateTaskDto, Priority, Status } from "../types/task";
import { TaskService } from "../service/TaskService";
import TaskFormModal from "./TaskFormModal";

const TaskManagementPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", filterStatus],
    queryFn: () =>
      filterStatus === "ALL"
        ? TaskService.getAllTasks()
        : TaskService.getTasksByStatus(filterStatus),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: CreateTaskDto) => TaskService.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: number; task: CreateTaskDto }) =>
      TaskService.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingTask(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TaskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-500 bg-red-100";
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-100";
      case "LOW":
        return "text-green-500 bg-green-100";
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "TODO":
        return "text-gray-500 bg-gray-100";
      case "IN_PROGRESS":
        return "text-blue-500 bg-blue-100";
      case "DONE":
        return "text-green-500 bg-green-100";
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "TODO":
        return <Clock className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <AlertCircle className="w-4 h-4" />;
      case "DONE":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === "ALL"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            All
          </button>
          {(["TODO", "IN_PROGRESS", "DONE"] as Status[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {getStatusIcon(status)}
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-sm p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(task.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600">{task.description}</p>

                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(isCreateModalOpen || editingTask) && (
        <TaskFormModal
          task={editingTask}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={(taskData) => {
            if (editingTask) {
              updateMutation.mutate({
                id: editingTask.id,
                task: taskData,
              });
            } else {
              createMutation.mutate(taskData);
            }
          }}
        />
      )}
    </div>
  );
};

export default TaskManagementPage;
