const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const User = require('../models/User');

// Route to send a connection request
router.post('/send-request', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    // console.log(senderId)
    // console.log(receiverId)
    // Check if sender and receiver are different
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    // Check if a request already exists
    const existingRequest = await Connection.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent." });
    }

    const newRequest = new Connection({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    await newRequest.save();
    return res.status(200).json({ message: "Connection request sent." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});

// routes/connection.js
router.post('/update-status', async (req, res) => {
    try {
      const { senderId, receiverId, status } = req.body;
  
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }
  
      // Find the connection request
      const connection = await Connection.findOne({ sender: senderId, receiver: receiverId, status: 'pending' });
  
      if (!connection) {
        return res.status(404).json({ message: "Connection request not found." });
      }
  
      // Update the status
      connection.status = status;
      await connection.save();
  
      return res.status(200).json({ message: `Connection request ${status}.` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error." });
    }
  });

  router.get('/pending-requests/:receiverId', async (req, res) => {
    const { receiverId } = req.params; 
    try {
        const requests = await Connection.find({ receiver: receiverId, status: 'pending' })
            .populate('sender', 'username'); 

        console.log(requests);
        res.json(requests); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

router.get('/connected-users/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const connections = await Connection.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted',
    }).populate('sender receiver', 'username'); 

    const connectedUsers = connections.map((connection) => {
      return connection.sender._id.toString() === userId ? connection.receiver : connection.sender;
    });

    res.json(connectedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching connected users' });
  }
});

  
module.exports = router;
