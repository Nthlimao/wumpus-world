const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'main.html'));
});

app.get('/favicon.png', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'favicon.png'));
});

app.get('/main.js', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'main.js'));
});

app.get('/styles.css', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'styles.css'));
});

app.get('/imgs/agente.png', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'imgs/agente.png'));
});

app.get('/imgs/wumpus.png', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'imgs/wumpus.png'));
});

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT ||  3001);