"use strict";

let fs = require("fs");
let path = require("path");
let express = require("express");

let app = express();
let port = process.env.PORT || 8000;
let pathToPetShop = path.join(__dirname, "pets.json");

//app.disable("x-powered-by");

app.get("/pets", (req, res) => {
  fs.readFile(pathToPetShop, "utf8", (readError, data) =>
    readError ? sendError500(res, readError) : res.status(200).send(JSON.parse(data)));
});

app.get("/pets/:id", (req, res) => {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if(readError) sendError500(res, readError);

    let id = Number.parseInt(req.params.id);
    let storedPets = JSON.parse(data);

    id < 0 || id > storedPets.length - 1 || Number.isNaN(id) ? res.sendStatus(404) : res.status(200).send(storedPets[id]);
  });
});

function sendError500(res, error) {
  console.error(error);
  res.status(500).send();
}

// app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Express Server running on port ${port}`));

module.exports = app;
