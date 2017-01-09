const express = require('express');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || "development";
const config = require('./config/config.json')[env];
const db = require('./db');

const app = express();

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.static("asset"));

app.get('/', (req, res) => {
    return res.json("dssd");
});
app.use('/users', require('./api/user/index.js'));

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1)
    } else {
        app.listen(config.port, () => {
            console.log('Example app listening on port 3000!');
        });
    }
})


module.exports = app;