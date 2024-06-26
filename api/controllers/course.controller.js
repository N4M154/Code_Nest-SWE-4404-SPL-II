import Course from "../models/course.model.js";

// controllers/course.controller.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserLevel = async (req, res, next) => {
  try {
    const { username, courseName } = req.params; // Correctly extract params from request
    console.log("Username:", username, "CourseName:", courseName);
    const course = await prisma.courses.findFirst({
      where: { username, courseName }, // Ensure these are the correct field names in your database schema
    });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course or user not found" });
    }
    res.status(200).json(course.level); // Assuming 'level' is a field in the returned course object
  } catch (error) {
    console.error("Error in getUserLevel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unlockNextLevel = async (req, res, next) => {
  const { username, courseName, courseTopic } = req.body;

  try {
    const course = await prisma.courses.findFirst({
      where: { username, courseName },
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course or user not found" });
    }

    if (
      (course.level < 1 && courseTopic === "helloworld") ||
      courseTopic === "helloworldcpp"
    ) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 1 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 1" });
    } else if (
      courseTopic === "variables" ||
      (courseTopic === "variablescpp" && course.level < 2)
    ) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 2 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 2" });
    } else if (
      courseTopic === "arrays" ||
      (courseTopic === "arrayquiz" && course.level < 3)
    ) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 3 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 3" });
    } else if (courseTopic === "operators" && course.level < 4) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 4 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 4" });
    } else if (courseTopic === "conditions" && course.level < 5) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 5 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 5" });
    } else if (courseTopic === "strings" && course.level < 6) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 6 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 6" });
    } else if (courseTopic === "forloops" && course.level < 7) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 7 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 7" });
    } else if (courseTopic === "whileloops" && course.level < 8) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 8 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 8" });
    } else if (courseTopic === "functions" && course.level < 9) {
      await prisma.courses.updateMany({
        where: { username, courseName },
        data: { level: 9 },
      });
      return res
        .status(200)
        .json({ success: true, message: "Level updated to 9" });
    }
    res.status(200).json({ success: false, message: "No update needed" });
  } catch (error) {
    console.error("Error in unlockNextLevel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkRegistration = async (req, res, next) => {
  const { username } = req.params;
  const { courseName } = req.query; // or req.body if you send it in the body

  try {
    // Check if the course registration already exists for the user
    const existingCourse = await Course.findOne({ username, courseName });
    if (existingCourse) {
      res.json({ isRegistered: true });
    } else {
      res.json({ isRegistered: false });
    }
  } catch (error) {
    next(error);
  }
};

export const registerCourse = async (req, res, next) => {
  try {
    const { courseName, username, level, hasStarted } = req.body;

    // Check if the course registration already exists
    const existingCourse = await Course.findOne({ courseName, username });
    if (existingCourse) {
      // If the registration exists, send a message and don't create a new one
      return res
        .status(409)
        .json({ message: "User is already registered for this course." });
    }

    // If no existing registration, create a new one
    const newCourse = new Course({ courseName, username, level, hasStarted });
    await newCourse.save();
    res.status(201).json({ message: "Course registered successfully!" });
  } catch (error) {
    next(error);
  }
};
