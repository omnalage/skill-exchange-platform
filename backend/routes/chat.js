const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
router.get('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    try {
      const chat = await Message.findOne({
        participants: { $all: [user1, user2] }
      });
  
      if (chat) {
        // Filter messages where the sender or receiver is either user1 or user2
        const filteredMessages = chat.messages.filter(
          (msg) => (msg.sender === user1 || msg.receiver === user1) && (msg.sender === user2 || msg.receiver === user2)
        );
  
        res.json({ messages: filteredMessages });
      } else {
        res.json({ messages: [] });  // No previous chat found
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  router.put('/update-chat', async (req, res) => {
  const { user1, user2, newMessage } = req.body;

  try {
    // Find the chat document with participants user1 and user2
    let chat = await Message.findOne({
      participants: { $all: [user1, user2] },
    });

    if (!chat) {
      // If chat does not exist, create a new one with the participants
      chat = new Message({
        participants: [user1, user2],
        messages: [],
      });
    }

    // Add the new message to the messages array
    chat.messages.push({
      sender: user1,
      receiver: user2,
      content: newMessage.content,
      timestamp: new Date(), // Or use the timestamp from the client if necessary
    });

    // Save the updated chat document
    await chat.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

  module.exports = router;