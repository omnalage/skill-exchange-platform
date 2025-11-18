const User = require('../models/User');

// Simple AI Algorithm: Jaccard Similarity Coefficient
// Measures similarity between two sets of data (tags)
const calculateSimilarity = (myInterests, otherUserSkills) => {
  if (!myInterests.length || !otherUserSkills.length) return 0;

  const interestsSet = new Set(myInterests.map(t => t.toLowerCase()));
  const skillsSet = new Set(otherUserSkills.map(t => t.toLowerCase()));

  // Find intersection (common tags)
  const intersection = [...interestsSet].filter(x => skillsSet.has(x));

  // Jaccard Index = (Intersection) / (Union)
  // You can also use a simpler weight: (Matches / Total Desired Skills)
  const union = new Set([...interestsSet, ...skillsSet]);
  
  return (intersection.length / union.size) * 100;
};

exports.getRecommendations = async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allUsers = await User.find({ _id: { $ne: currentUserId } }); // Exclude self

    // Calculate score for every user
    const recommendations = allUsers.map(user => {
      const score = calculateSimilarity(currentUser.learning, user.skills);
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        skills: user.skills,
        avatar: user.avatar, // Assuming you added avatar field later
        matchScore: Math.round(score) // Round to whole number
      };
    })
    .filter(user => user.matchScore > 0) // Only show relevant people
    .sort((a, b) => b.matchScore - a.matchScore) // Highest match first
    .slice(0, 5); // Limit to top 5 suggestions

    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};