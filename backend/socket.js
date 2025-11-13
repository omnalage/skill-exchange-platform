const { Server } = require('socket.io');
const Message = require('./models/Message'); // Import your Message model

const initSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room with user1 and user2 identifiers (could be based on user IDs)
    socket.on('joinRoom', ({ user1, user2 }) => {
      // Creating a unique room name based on both user IDs (avoids room name collision)
      const room = [user1, user2].sort().join('-');
      socket.join(room); // Join the chat room
      console.log(`User joined room: ${room}`);
    });

    // Handle incoming messages
    socket.on('sendMessage', async (message) => {
      try {
        // Save message to the database
        const newMessage = new Message({
          sender: message.sender,
          receiver: message.receiver,
          content: message.content,
          timestamp: new Date(),
        });

        await newMessage.save();

        // Emit message to the correct room
        const room = [message.sender, message.receiver].sort().join('-');
        io.to(room).emit('receiveMessage', message); // Emit to the room where users are connected

        console.log('Message sent:', message);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });
};

module.exports = initSocket;
