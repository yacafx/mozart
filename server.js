const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const fs = require('fs');
const https = require('https');
const http = require('http');
const topojson = require('topojson-client');

const app = express();



app.use(express.static(path.join(__dirname, "dist")));

app.use(favicon(path.join(__dirname, "dist", "favicon.ico")));

//  Arrow function     ()=>{}
app.get('/', function (req, res) {
    res.sendFile('index.html');
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

apiV2.get('/edomex', function (req, res) {

    http.get('http://localhost:3000/DF_SCINCE.json', function (response) {

        var body = '';

        response.on('data', function (d) {
            body += d;
        });

        response.on('end', function () {
            try {
                var edomex = JSON.parse(body);

                res.status(200).json({
                    status: true,
                    edomex: edomex
                });
            } catch (err) {
                console.error('Error: ', err);
            }
        })
    })



});



apiV2.get('/paises/estados/ciudades', function (req, res) {

    var ciudades = [];
    var worldData = [];


    var worldJson = 'https://unpkg.com/world-atlas@1.1.4/world/110m.json';

    fs.readFile('dist/cities.json', 'utf-8', function (err, data) {
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



    //res.send('info de estados');
});




app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${ PORT }`);
});