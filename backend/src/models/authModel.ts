import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const Document = mongoose.Document;

interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
      default: "profile-picture/default-profile-picture.png"
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    premium: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

// check if the email and password are valid
userSchema.statics.register = async function (
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  profilePicture: string = "profile-picture/default-profile-picture.png"
) {
  if (!email || !username ||  !password || !firstName || !lastName) {
    throw new Error("All fields are required");
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

  const existingEmail = await this.findOne({ email });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const existingUsername = await this.findOne({ username });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await this.create({
    email,
    username,
    password: hashedPassword,
    firstName,
    lastName,
    profilePicture,
  });

  return user;
};

userSchema.statics.login = async function (username: string, password: string) {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw new Error("Invalid username");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }

  return user;
};

const User = mongoose.model<IUser>("User", userSchema);

module.exports = User;
