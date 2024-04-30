import mongoose from "mongoose";
import { TaskDocument } from "./task.model";
import { UserDocument } from "./user.model";

export interface NotifInput {
  user: UserDocument["_id"];
  task: TaskDocument["_id"];
  isRead: boolean;
}

export interface NotifDocument extends NotifInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const notifSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NotifModel = mongoose.model<NotifDocument>("Notif", notifSchema);

export default NotifModel;
