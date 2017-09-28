"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let basicAuth = require("basic-auth");
let morgan = require("morgan");
let path = require("path");
let fs = require("fs");

let app = express();
let port = process.env.PORT || 8000;
let pathToPetShop = path.join(__dirname, "pets.json");

app.use(morgan("short"));

app.use(bodyParser.json());

app.disable("x-powered-by");

app.use((req, res, next) => {
  let credentials = basicAuth(req);

  if (!credentials || credentials.name != "admin" || credentials.pass != "meowmix") {
    res.set("WWW-Authenticate", 'Basic realm="Required"');
    res.sendStatus(401);
  } else {
    return next();
  }
});

app.get("/pets", (req, res, next) => {
  fs.readFile(pathToPetShop, "utf8", (readError, data) =>
    readError ? res.status(500) : res.status(200).send(JSON.parse(data)));
});

app.get("/pets/:id", (req, res, next) => {
  let storedPets, requestedID;

  isNaN(req.params.id) ? res.sendStatus(400) : requestedID = Number.parseInt(req.params.id)

  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    readError ? res.sendStatus(500) : storedPets = JSON.parse(data);

    (requestedID >= 0 && requestedID < storedPets.length) ? res.status(200).send(storedPets[requestedID]) : next()
  });
});

app.post("/pets", (req, res, next) => {
  let allPets, newPet = req.body;

  fs.readFile(pathToPetShop, "utf8", (readError, data) =>
    readError ? res.sendStatus(500) : allPets = JSON.parse(data));

  (!newPet.age || !newPet.kind || !newPet.name) ? res.sendStatus(400) : allPets.push(newPet)

  fs.writeFile(pathToPetShop, JSON.stringify(allPets), (writeError) =>
    writeError ? res.status(500) : res.status(200).send(newPet));
});

app.patch("/pets/:id", (req, res, next) => {
  let allPets, requestedID;

  isNaN(req.params.id) ? res.sendStatus(400) : requestedID = Number.parseInt(req.params.id)

  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    readError ? res.sendStatus(500) : allPets = JSON.parse(data)

    if (requestedID < 0 && requestedID >= allPets.length - 1) next();

    // Straight out of Crushing Candy Code !!!
    for (let key of ["age", "kind", "name"]) {
      if (req.body.hasOwnProperty(key)) allPets[requestedID][key] = req.body[key];
    }
  });

  fs.writeFile(pathToPetShop, JSON.stringify(allPets), (writeError) =>
    writeError ? res.sendStatus(500) : res.type("application/json").status(200).send(allPets[requestedID]));
});

app.delete("/pets/:id", (req, res, next) => {
  let allPets, requestedID, deletedPet;

  isNaN(req.params.id) ? res.sendStatus(400) : requestedID = Number.parseInt(req.params.id)

  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    readError ? res.sendStatus(500) : allPets = JSON.parse(data)

    if (requestedID < 0 && requestedID >= allPets.length - 1) next();
    deletedPet = allPets.splice(requestedID, 1)[0];
  });

  fs.writeFile(pathToPetShop, JSON.stringify(allPets), (writeError) =>
    writeError ? res.sendStatus(500) : res.type("application/json").status(200).send(deletedPet));
});

app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Express Server running on port ${port}`));

module.exports = app;
