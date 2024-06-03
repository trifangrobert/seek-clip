import mongoose, { Schema, Document } from "mongoose";

interface IConversation extends Document {
    members: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
}

const conversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { collection: "conversations", timestamps: true }
);


const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);

module.exports = Conversation;