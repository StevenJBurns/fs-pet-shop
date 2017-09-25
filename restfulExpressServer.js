"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");
let fs = require("fs");

let app = express();
let port = process.env.PORT || 8000;
let pathToPetShop = path.join(__dirname, "pets.json");

app.use(bodyParser.json());

app.get("/pets", (req, res, next) => {
  fs.readFile(pathToPetShop, "utf8", (readError, data) =>
    readError ? res.status(500) : res.status(200).send(JSON.parse(data)));
});

app.get("/pets/:id", (req, res, next) => {
  let storedPets, reqID;

  isNaN(req.params.id) ? res.sendStatus(400) : reqID = Number.parseInt(req.params.id)

  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    readError ? res.sendStatus(500) : storedPets = JSON.parse(data);

    (reqID >= 0 && reqID < storedPets.length) ? res.status(200).send(storedPets[reqID]) : next()
  });
});

app.post("/pets", (req, res, next) => {
  let allPets, newPet = req.body;

  fs.readFile(pathToPetShop, "utf8", (readError, data) =>
    readError ? res.sendStatus(500) : allPets = JSON.parse(data));

  (!newPet.age || !newPet.kind || !newPet.name) ? res.sendStatus(400) : allPets.push(newPet)

  fs.writeFile(pathToPetShop, JSON.stringify(allPets), (writeError) =>
    writeError ? res.sendStatus(500) : res.status(200).send(newPet));
});

app.patch("/pets/:id", (req, res) => );

app.delete("/pets/:id", (req, res) => );

app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Express Server running on port ${port}`));

module.exports = app;
