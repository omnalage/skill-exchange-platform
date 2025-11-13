const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/profile/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

router.put('/profile/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
