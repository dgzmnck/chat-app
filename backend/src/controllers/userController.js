import * as userService from "../services/userService.js";
import { AppError } from "../utils/AppError.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Controller: getUsers →", err);
    res.status(err.statusCode || 500).send(err.message || "Server Error");
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new AppError("Name and email are required", 400);
    }

    const newUser = await userService.createUser(name, email);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Controller: createUser →", err);
    res
      .status(err.statusCode || 500)
      .send(err.message || "Failed to create user");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      throw new AppError("Name and email are required for update", 400);
    }

    const updatedUser = await userService.updateUser(id, name, email);
    res.json(updatedUser);
  } catch (err) {
    console.error("Controller: updateUser →", err);
    res
      .status(err.statusCode || 500)
      .send(err.message || "Failed to update user");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    console.error("Controller: deleteUser →", err);
    res
      .status(err.statusCode || 500)
      .send(err.message || "Failed to delete user");
  }
};
