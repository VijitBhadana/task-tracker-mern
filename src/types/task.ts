export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'Completed';

export interface Task {
  _id: string;                // 🔹 MongoDB ID
  title: string;
  description?: string;       // optional
  priority: Priority;
  due_date: string;
  status: Status;
  createdAt?: string;         // 🔹 MongoDB timestamps
  updatedAt?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  due_date: string;
  status: Status;
}
