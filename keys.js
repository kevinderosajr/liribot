console.log('this is loaded');

exports.omdb = {
  api_key: process.env.OMDB_API_KEY
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

