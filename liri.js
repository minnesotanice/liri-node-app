// code to read and set any environment variables with the dotenv package
require("dotenv").config();


// Load the fs package to read and write
var fs = require("fs");

// require Twitter
var Twitter = require("twitter");

// require Spotify
var Spotify = require("node-spotify-api");


// Add code required to import the `keys.js` file and store it in a variable
var keys = require("./keys.js");

// Now I can access my keys information like so
var client = new Twitter(keys.twitter);
var Spotify = new Spotify(keys.spotify);


var command = process.argv[2];
var parameter = process.argv[3];


processCommandLine(command, parameter);


function processCommandLine(command, parameter) {
	switch (command) {
		case 'my-tweets':
			fetchTwitter();
			break;

		case "spotify-this-song":
			fetchSpotify(parameter);
			break;

		case "movie-this":
			fetchOMDB(parameter);
			break;

		case "do-what-it-says":
			fetchRandom();
			break;

		default:
			break;
	}
}

// 1. `node liri.js my-tweets`
function fetchTwitter() {
	var tweetsLength;

	//From twitter's NPM documentation, grab the most recent tweets
	var params = {
		screen_name: 'PixelGypsyBot'
	};
	client.get('statuses/user_timeline', function (error, tweets, response) {
		if (error) throw error;

		//Loop through the number of tweets that were returned to get the number of tweets returned.
		//If the number of tweets exceeds 20, make it 20.
		//Then loop through the length of tweets and return the tweets date and text.
		tweetsLength = 0;

		for (var i = 0; i < tweets.length; i++) {
			tweetsLength++;
		}
		if (tweetsLength > 20) {
			tweetsLength = 20;
		}
		// for (var i = 0; i < tweetsLength; i++) {

		// console.log(
		// 	`\n`,
		// 	`Tweet`, (i + 1), `created on: ${tweets[i].created_at}`,
		// 	`\n`,
		// 	`\"${tweets[i].text}\"`,
		// 	`\n`
		// );
		// }

		for (var i = 0; i < tweetsLength; i++) {
			var tweetCount = (i + 1);
			var tweetResults = 
`\nTweet ${tweetCount} created on: ${tweets[i].created_at}
\"${tweets[i].text}\"\n`;

			console.log(tweetResults);
			appendFile(tweetResults);

		}




	});
}

// 2. `node liri.js spotify-this-song '<song name here>'`
function fetchSpotify(parameter) {



	Spotify.search({
		type: 'track',
		query: parameter
	}, function (err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		// console.log(
		// 	`\n`,
		// 	`Artist(s): ${data.tracks.items[0].artists[0].name}`,
		// 	`\n`,
		// 	`Song Name: ${data.tracks.items[0].name}`,
		// 	`\n`,
		// 	`Preview Link for Song: ${data.tracks.items[0].external_urls.spotify}`,
		// 	`\n`,
		// 	`Album: ${data.tracks.items[0].album.name}`,
		// 	`\n`,
		// );

		var spotifyResults = `
Artist(s): ${data.tracks.items[0].artists[0].name}
Song Name: ${data.tracks.items[0].name}
Preview Link for Song: ${data.tracks.items[0].external_urls.spotify}
Album: ${data.tracks.items[0].album.name}
			`;

		console.log(spotifyResults);
		appendFile(spotifyResults);

	});
};


// 3. `node liri.js movie-this '<movie name here>'`
function fetchOMDB(parameter) {

	// http://www.omdbapi.com/?t=spiderman&apikey=trilogy
	var request = require("request");

	var baseURL = "http://www.omdbapi.com/?t=";
	var title = parameter;
	var APIkey = "&apikey=trilogy";

	var queryURL = baseURL + title + APIkey;

	request(queryURL, function (error, response, body) {


		// EXAMPLE FROM https://developer.mozilla.org/en-US/docs/Web/API/Console/log
		// console.log(JSON.parse(JSON.stringify(obj)));
		// my question is, why stringify when it doesn't seem necessary?

		var movie = JSON.parse(body);

		// console.log(
		// 	`\n`,
		// 	`Title: ${movie.Title}`,
		// 	`\n`,
		// 	`Year: ${movie.Year}`,
		// 	`\n`,
		// 	`IMDB Rating: ${(movie.Ratings[0]) ? (movie.Ratings[0].Value) : "N/A"}`,
		// 	`\n`,
		// 	`Rotten Tomatoes Rating: ${(movie.Ratings[0]) ? (movie.Ratings[1].Value) : "N/A"}`,
		// 	`\n`,
		// 	`Country: ${movie.Country}`,
		// 	`\n`,
		// 	`Language: ${movie.Language}`,
		// 	`\n`,
		// 	`Plot: ${movie.Plot}`,
		// 	`\n`,
		// 	`Actors: ${movie.Actors}`,
		// 	`\n`,
		// );



		var movieResults = `
Title: ${movie.Title}
Year: ${movie.Year}
IMDB Rating: ${(movie.Ratings[0]) ? (movie.Ratings[0].Value) : NA}
Rotten Tomatoes Rating: ${(movie.Ratings[0]) ? (movie.Ratings[1].Value) : NA}
Country: ${movie.Country}
Language: ${movie.Language}
Plot: ${movie.Plot}
Actors: ${movie.Actors}
`;

		console.log(movieResults);
		appendFile(movieResults);

	});

	// append file test
	//appendFile(this);

};

// 4. `node liri.js do-what-it-says`

//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

//      * Feel free to change the text in that document to test out the feature for other commands.

function fetchRandom() {

	fs.readFile("random.txt", "utf8", function (err, fileContent) {

		if (err) {
			return console.log(err);
		}

		// console.log(fileContent);

		// Create array from string with split()
		// Every comma, push element into array
		var fileContentArray = fileContent.split(",");

		// console.log(fileContentArray);

		command = fileContentArray[0];
		parameter = fileContentArray[1];

		processCommandLine(command, parameter);

	});
};

// Output the data to a .txt file called `log.txt`. Append each command to the `log.txt` file. 
function appendFile(data) {

	//Output all that happens into a log.txt file
	fs.appendFile("log.txt", data, function (err) {

		//If an error happens while trying to write to the file
		if (err) {
			return console.log(err);
		}
	});
};