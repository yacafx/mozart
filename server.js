const express = require("express");
const path = require("path");
const fs = require('fs');
const https = require('https');
const http = require('http');
const topojson = require('topojson-client');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

// CORS config
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});


app.get('/', function (req, res) {
    res.send('Bienvenido a la GEO API');
});

var apiV1 = express.Router();
var apiV2 = express.Router();

apiV1.get('/', function (req, res) {
    res.send('Bienvenido al API v1');
});

apiV1.get('/estados', function (req, res) {


    var estados = [{
            name: 'Aguascalientes',
            population: 123456
        },
        {
            name: 'Guerrero',
            population: 65476587
        }
    ];

    res.status(200).json({
        status: true,
        estados: estados
    });

    //res.send('info de estados');
});


apiV2.get('/', function (req, res) {
    res.send('Bienvenido al API v2');
});

apiV2.get('/paises', function (req, res) {
    res.send('info de países');
});



apiV2.get('/paises/estados/ciudades', function (req, res) {

    var ciudades = [];
    var worldData = [];


    var worldJson = 'https://unpkg.com/world-atlas@1.1.4/world/110m.json';

    fs.readFile('data/cities.json', 'utf-8', function (err, data) {
        //console.log(err, data);
        ciudades = JSON.parse(data).states;


        https.get(worldJson, function (response) {

            var body = '';

            response.on('data', function (d) {
                body += d;
            });

            response.on('end', function () {
                try {
                    worldData = JSON.parse(body);
                    worldData = topojson.feature(worldData, worldData.objects.countries);

                    //console.log(worldData)

                    res.status(200).json({
                        status: true,
                        ciudades: ciudades,
                        worldData: worldData
                    });

                } catch (err) {
                    console.error('Error: ', err);
                }
            });

            // console.log(response);


        });




    });

});

app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);




app.listen(PORT, () => {
    console.log(`Server listening on port ${ PORT }`);
});