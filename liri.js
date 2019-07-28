require("dotenv").config();

const keys = require("./keys.js");

const axios = require('axios');
const fs = require("fs");
const moment = require('moment');
const spotify = require('node-spotify-api');

let spotify = new spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
  });

const command = process.argv[2];
const value = process.argv.slice(3).join(" ");

switch (command) {
    case "concert-this":
      concertThis(value)
      break;
    case "spotify-this-song":
      getMySong(value)
      break;
    case "movie-this":
      movieThis(value)
      break;
    case "doIt":
      doIt()
      break;
    default:
      break;
  }

function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
      .then(function (response, err) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        let venue = response.data[0].venue.name;
        let venueLocation = response.data[0].venue.name;
        console.log("Venue Name:", venue);
        console.log("Location:", venueLocation);
        let eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
        console.log("Event Date:", eventDate);
        fs.appendFileSync("log.txt", "Artist: " + artist + "\nVenue Name: " + venue + "\nVenue Location: " + venueLocation + "\nEvent Date: " + eventDate + "\n----------------\n", function (error) {
          if (error) {
              console.log(error);
          } 
      });
  });
}

function getMySong(songName) {  
    if (!songName) {
      songName = "Wish You Were Here";
    }
    spotify.search({ type: 'track', query: songName }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      let artist = data.tracks.items[0].album.artists[0].name;
      console.log("Artist: ", artist)

      console.log("Song Name: ", data.tracks.items[0].name)
      
      let preview_url = data.tracks.items[0].preview_url
      console.log("Preview Link: ", preview_url)
      
      let albumName = data.tracks.items[0].album.name
      console.log("Album Name: ", albumName)
      
      fs.appendFileSync("log.txt", "Artist: " + artist + "\nSong Name: " + songName + "\nPreview Link: " + preview_url + "\nAlbum Name: " + albumName + "\n----------------\n", function (error) {
        if (error) {
            console.log(error);
        } 
    });
    });
  }

function movieThis(movieName) {

    if (!movieName) {
     movieName = "Disturbia";
   }
   axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
     .then(function (data) {
       let results = `
       Title of the movie: ${data.data.Title}
       Year Released: ${data.data.Year}
       IMDB Rating: ${data.data.Rated}
       Rotten Tomatoes Rating: ${data.data.Ratings[1].Value}
       Country of Production: ${data.data.Country}
       Language: ${data.data.Language}
       Plot of the movie: ${data.data.Plot}
       Cast: ${data.data.Actors}`;
       console.log(results)
      
      fs.appendFileSync("log.txt", results + "\n----------------\n", function (error) {
        if (error) {
            console.log(error);
        } 
    });
    })
    .catch(function (error) {
      console.log(error);
    });
    
    if (movieName === "Disturbia") {
        console.log("-----------------------");
        console.log("If you haven't seen 'Disturbia,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("You can stream it!");
    };
  }

function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
      data = data.split(",");
      let action = data[0]
      let value = data[1]
      switch (action) {
        case "concert-this":
          concertThis(value)
          break;
        case "spotify-this-song":
          getMySong(value)
          break;
      }
    
      fs.appendFileSync("log.txt", value + "\n----------------\n", function (error) {
        if (error) {
            console.log(error);
        } 
    });
    });
  }