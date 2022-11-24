// import path from "path";
// import { google } from "googleapis";

const Express = require("express");
const path = require("path");
const {google} = require("googleapis");
const app = Express();


const staticPath = path.join(__dirname,"/public");

app.set("view engine", "ejs");
app.use(Express.urlencoded({ extended: true }));

app.use(Express.static(staticPath));

// const publicpath = path.resolve(__dirname,'public');
// app.use(publicpath, Express.static('static'));




app.get('/',async (req,res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile : "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets", //change this
    })

    //Create client instance for auth
    const client = await auth.getClient();

    //Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "15sm--AVUkYGCOWPlF0pq_t477GxDbIOWYTvDXRVptQo";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A2:G",
    });

    let data = getRows.data.values;

    //converting into object
    let json = data.map(function(x) {
        return {    
            "id": x[0],
            "name": x[1],
            "classes": x[2],
            "assignment":x[3],
            "pic": x[4],
            "feedback": x[5],
            "pts":x[6]
        }
    })
    //logging onto server terminal
    console.log(json)

    //passing show.ejs and data of json variable
    res.render("show",{ json });
})

//Starting server
app.listen(3000, (req,res)=>{
    console.log("running on port 3000");
})




