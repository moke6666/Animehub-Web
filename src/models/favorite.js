const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  animeId: { type: String, required: true }
}, { 
  _id: true,  
  versionKey: false 
});

favoriteSchema.index({ username: 1, animeId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
