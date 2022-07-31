const {Pool} = require("pg")
const express = require ("express")
const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: "ksmbjewaoagmnh",
    host: "ec2-54-247-71-245.eu-west-1.compute.amazonaws.com",
    database: "d3ggqrrplo5gpa",
    password: "5359e6ab822b75f46b9283b167b0f18adbfe5abc5ba3379452df0be7eeb8f999",
    port: 5432,
    sslmode: "require",
    ssl: {
        rejectUnauthorized: false
    }
});

var PORT = process.env.PORT || 80

app.use(express.json())
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/styles", express.static(__dirname + '/styles'))
app.use("/pictures", express.static(__dirname + '/pictures'))
app.use("/videos", express.static(__dirname + '/videos'))

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

app.post('/table', async (req, res) => {  

    let category = req.body.category
    let app_name = req.body.app_name

    try{
        rows = await finalResult(category, app_name)
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(rows))
    }

})  

app.post('/display_dropdown', async (req, res) => {  

    // POST method to give back the elements for the dropdown list using the function dropdownNames

    let category = req.body.category
    try{
        rows = await dropdownNames(category)

    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(rows))
    }

})

app.listen(PORT, '0.0.0.0', () => console.log("Web server is listening.. on port 80"))

start()

// Start of functions

async function start() {

    // Function to start the NodeJS Server

    await connect();
}

async function connect() {

    // Function to connect to the server

    try {
        await pool.connect(); 
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function dropdownNames(category) {

    // Function to dynamically get the elements for the product name dropdown list

    try {
        const results = await pool.query(`SELECT chinese_name FROM ${category}`)
        return results.rows
    }
    catch(e){
        return[]
    }
}

async function finalResult(category, app_name) {

    // Function to fetch the Chinese Product Name and the Alternative Product Name from the SQL database

    try {
        const results = await pool.query(`SELECT chinese_name, alternative_name FROM ${category} WHERE chinese_name IN ('${app_name}')`);
        return results.rows;
    }
    catch(e){
        return [];
    }
}

// End of functions
