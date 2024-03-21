import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const Document = mongoose.Document;

interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

// check if the email and password are valid
userSchema.statics.register = async function (email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  // if (password.isStrongPassword(password)) {
  //   throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
  // }

  const existing = await this.findOne({ email });

  if (existing) {
    throw {message: "Email already exists", code: 11000};
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await this.create({
    email,
    password: hashedPassword,
  });

  return user;
};

userSchema.statics.login = async function (email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Invalid email");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }

  return user;
};

const User = mongoose.model<IUser>("User", userSchema);

module.exports = User;
