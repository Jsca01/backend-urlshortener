require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

var myUrls = []; // mongo not required for use var 

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req,res) =>{
	let url = req.body.url.toString();
	if (!(url.includes("https://") || url.includes("http://"))){
		return res.json({"error":'invalid url'});
	}
	let id = myUrls.length;
	myUrls.push({"value":url});
	return res.json({"original_url":url,"short_url":id});
});
app.get("/api/shorturl/:id", (req,res) =>{
	let id = req.params.id;
	if(myUrls.length < id){return res.send("invalid");}
	let url = myUrls[id].value;
	return res.redirect(303, myUrls[id].value);
	});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
