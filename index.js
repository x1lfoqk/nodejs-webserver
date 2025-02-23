const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const app = express()
const port = 80

// This tells the express framework to allow accepting certain types of data formats sent from a browser.
app.use(bodyParser.json());         // to support JSON posts
app.use(bodyParser.urlencoded({     // to support form posts
  extended: true
}));

app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);

// This registers a function to be called if we receive a form post message to the root URL of the server.
app.post('/', function (req, res) {
	res.render('done.html');
	
	// You can save the name and email in a database here.
	
	// Lets write the data in to a text file for fun.
	fs.appendFile('details.txt', 'name: ' + req.body.name, function (err) {
	  console.log('Saved!');
	});
	
	// Save to mongodb!
	// Connect to mongo.
	MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
		var dbo = db.db("contacts");
		dbo.collection("contacts").insertOne({ name: req.body.name, email: req.body.email }, function(err, res) {
			console.log("Inserted " + res.insertedCount + " document.");
			db.close();
		});
	});
})

// This instructs the server to use "index.html" if the client browses to the root URL.
var options = {
	index: "index.html"
};

// This tells express to serve any files in the 'public' folder over the web.
app.use(express.static('public', options))

// This sets the server going on our port 3000. So, if you run this and go to http://localhost:3000, you'll see the
// "index.html" page load in your browser.
app.listen(port, () => console.log(`Example app listening on port ${port}.`))
