import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface TaskInput {
  user: UserDocument["_id"];
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: number;
  completed?: boolean;
  hasReminder?: boolean;
}

export interface TaskDocument extends TaskInput, mongoose.Document {
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      default: () => `task_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    priority: { type: Number, default: 4 },
    completed: { type: Boolean, default: false },
    hasReminder: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);

export default TaskModel;
