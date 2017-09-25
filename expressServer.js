"use strict";

let express = require("express");
let path = require("path");
let fs = require("fs");

let app = express();
let port = process.env.PORT || 8000;
let pathToPetShop = path.join(__dirname, "pets.json");

/* The follwing app.use is essentially what body-parser looks like under the hood.
I attempted this part of Pet-Shop thinking I could emulate that functionality without
using the body-parser module.  My attempt was close but I am certain I would not have
accomplished it alone.  This code will remain in this exercise but in the future all
my code will import and call the body-parser module when using Express and CRUD */
app.use((req, res, next) => {
  var completeChunk = "";
  req.on("data", (chunk) => completeChunk += chunk);
  req.on("end", () => {
    req.rawBody = completeChunk;

    if (completeChunk && completeChunk.indexOf("{") > -1 ) req.body = JSON.parse(completeChunk);
    next();
  });
});

app.get("/pets", (req, res, next) => {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if(readError) {
      res.status(500);
      next(readError);
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
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

app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Express Server running on port ${port}`));

module.exports = app;
