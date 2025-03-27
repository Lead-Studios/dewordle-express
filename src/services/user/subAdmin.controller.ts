import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

export const createSubAdmin = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const subAdmin = await User.create({
    username,
    email,
    password: hashedPassword,
    role: "sub-admin",
  });
  res.status(201).json({ message: "Sub-admin created successfully", subAdmin });
};

export const getSubAdmins = async (req: Request, res: Response) => {
  const subAdmins = await User.find({ role: "sub-admin" });
  res.json(subAdmins);
};

export const updateSubAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email } = req.body;

    const subAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true } // Ensures updated fields are validated
    );

    if (!subAdmin) {
      res.status(404).json({ message: "Sub-admin not found" });
      return;
    }

    res.status(200).json({ message: "Sub-admin updated", subAdmin });
  } catch (error) {
    next(error); // Ensure errors are handled properly
  }
};

export const deleteSubAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subAdmin = await User.findByIdAndDelete(req.params.id);

    if (!subAdmin) {
      res.status(404).json({ message: "Sub-admin not found" });
      return;
    }

    res.status(200).json({ message: "Sub-admin deleted successfully" });
  } catch (error) {
    next(error); // Properly forward errors to Express error handler
  }
};
