// controllers/profileController.js
const Profile = require('../models/profileModel');
const db = require('../db/database.js');

// POST /api/profile
const saveProfile = (req, res) => {
  const profile = req.body;
  if (!profile.id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  Profile.saveProfile(profile, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save profile' });
    }
    res.json({ success: true });
  });
};

// GET /api/profile/:id
const getProfile = (req, res) => {
  const { id } = req.params;

  Profile.getProfileById(id, (err, profile) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  });
};

const getAllProfiles = (req, res) => {
  Profile.getAllProfiles((err, profiles) => {
    if (err) {
      console.error('❌ Failed to fetch profiles:', err.message);
      return res.status(500).json({ error: 'Failed to fetch profiles' });
    }
    res.json(profiles);
  });
};

module.exports = {
  saveProfile,
  getProfile,
  getAllProfiles
};
