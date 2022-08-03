// This is the express server including endpoints API.

const express = require('express')
const fs = require('fs')
const path = require('path')
// imported unique id generator
// will always create unique id 
const uniqid = require('uniqid')

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// show the index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

// show the written notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// show the taken notes
app.get('/api/notes', (req, res) => {
    // Use fs module to read db.json
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) { console.log(err); return; }
        console.log("Successfully read json")
        // send the request back to render the clicked note
        res.send(data);
    });
})

// update new notes
app.post('/api/notes', (req, res) => {
    console.log("inside post")
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        // Write new data to overload the old data
        var json = JSON.parse(data)
        // Create an object to hold new data
        var newData = {}
        // Get new id using uniqid library
        newData['id'] = uniqid();
        // Get the user input and assign it as 'text' key
        newData['text'] = req.body['text']
        // Get the user input and assign it as 'title' key
        newData['title'] = req.body['title']
        // Add them to the json data array
        json.push(newData);
        // Write the file to db.json to update the database
        fs.writeFile('db/db.json', JSON.stringify(json), (err, data) => {
            console.log("callback from writefile");
        })
    })
})

// connection to server
app.listen(PORT, () => {
    console.log('Server connected at:', PORT);
});