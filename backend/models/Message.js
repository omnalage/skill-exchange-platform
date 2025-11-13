const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  participants: [String],  // Array of participants (user1 and user2)
  messages: [
    {
      sender: String,       // The sender of the message
      receiver: String,     // The receiver of the message
      content: String,      // The message content
      timestamp: { type: Date, default: Date.now }, // Timestamp of the message
    },
  ],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
