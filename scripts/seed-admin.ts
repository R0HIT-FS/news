import "./bootstrap";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db/mongodb";
import User from "../models/User";

async function seedAdmin() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASSWORD!;
    const name = process.env.ADMIN_NAME!;

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin");
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();
