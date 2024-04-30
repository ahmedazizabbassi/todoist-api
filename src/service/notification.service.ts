import { CronJob } from "cron";
import { FilterQuery } from "mongoose";
import NotifModel, {
  NotifDocument,
  NotifInput,
} from "../models/notification.model";
import { TaskDocument } from "../models/task.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";
import { getTasks } from "./task.service";

export const notifJob = new CronJob(
  "* * * * *", // cronTime
  async function () {
    const tasks = await getTasks({ hasReminder: true });
    const notifCreationPromises = (tasks as TaskDocument[]).map(async (task: TaskDocument) =>
      (!await getAsingleNotif({ task: task._id })) && task.hasReminder
        ? createNotif({ user: task.user, task: task._id, isRead: false })
        : null
    );
    await Promise.all(notifCreationPromises);
  }, // onTick
  null, // onComplete
  false, // start
  "America/Los_Angeles" // timeZone
);

export async function getNotifs(query: FilterQuery<NotifDocument>) {
  const metricsLabels = {
    operation: "getNotifs",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await NotifModel.find(query).lean();
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function getAsingleNotif(query: FilterQuery<NotifDocument>) {
  const metricsLabels = {
    operation: "getAsingleNotif",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await NotifModel.findOne(query).lean();
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function createNotif(input: NotifInput) {
  const metricsLabels = {
    operation: "createNotif",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await NotifModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function deleteAllNotifs() {
  const metricsLabels = {
    operation: "deleteAllNotifs",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await NotifModel.deleteMany({ isRead: false });
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}
