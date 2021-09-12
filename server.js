//importing the required files
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./Develop/helpers/uuid');
const util = require('util');
const notesjs = require('./Develop/db/db.json');

// initilize the app and create a port
const app = express();
var PORT = process.env.PORT || 3001;

// Sets up express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

//promise  version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 * Function to write to the JSON file with 2 parameters 1, Destination  2, Content
 * @param {string} destination The file you want to write to
 * @param {string} content The content being writen to the file
 * @returns {void} Nothing
 */

 const writeToFile =(destination, content) =>
 fs.writeFile(destination, JSON.stringify(content, null, 2),(err) =>
   err ? console.error(err): console.info(`\nData written to ${destination}`)
 );

/**
* Function to read to from file and append Content
* @param {string} content the content to read and append to the file
* @param {string} file The content being writen to the file
* @returns {void} Nothing
*/

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err){
            console.error(err);
        }else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

//Get route for retrieving all the notes
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
    console.info("Read db.json")
});

//Create new notes
app.post("/api/notes",(req, res) => {
    console.info(`${req.method} request received to add a note`);
    const { title, text } = req.body;
    if(req.body){
        const newNote = {
            title,
            text,
            id: uuid()
        };

        readAndAppend(newNote, "./db/db.json")
        res.json(`Note added successfully `);
    } else {
        res.json("error while adding Notes")
    }
});

//Delete the note: for deleting the note, we need to specify the d of the note which we are going to delete

app.delete('/api/note/:id', (req, res) =>{
    console.info("in the delete section");
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        //make a new array except for the one with the ID provided in the URL
        const result = json.filter((notesjs) => notesjs.id !==noteId);
        //save that array to the filesystem
        writeToFile('./db/db.json', result);
        //respond to the DELETE request
        res.json(`Item ${noteId} has been deleted `);
    });
});

// Get route for notes page
app.get("/notes", (req,res) =>
    res.sendFile(path.join(__dirname,'/public/notes.html'))
);

//Get routes for wildcard route
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
 );

 app.listen(PORT, () =>
 console.log(`App listenning at http://localhost:${PORT}`)
 );
