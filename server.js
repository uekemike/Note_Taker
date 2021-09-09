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
    fs.readFile(file, 'utf8', (err, data) =>{
        if(err){
            console.error(err);
        }else {
            const parseData = JSON.parse(data);
            parseData.push(content);
            writeToFile(file, parseData);
        }
    });
};

//Get route for retrieving all the notes
app.get("/api/notes", (req, res) =>
console.info(`${req.method} request received for notes`);
readFromFile())
