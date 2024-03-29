var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
app.set('view engine', 'ejs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
      secret: "cmpe273_kafka_passport_mongo",
      resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
      saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
      duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
      activeDuration: 5 * 60 * 1000
    })
);

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.post("/calculateExp", (req, res) => {
    console.log("Data Received: " + req.body.expression);
    let expression = req.body.expression;
    let result = 0;
    try {
        result = eval(expression);
        
        console.log("Result of expression is: ", result);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end(JSON.stringify(result));
    }
    catch(error){
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        })
        res.end("Invalid Expression! Please provide valid expression");
    }

})

app.listen(3001, () => {
    console.log("Server Listening on port 3001");
});
