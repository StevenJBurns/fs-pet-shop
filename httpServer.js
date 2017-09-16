"use strict";

let fs = require("fs");
let http = require("http");
let path = require("path");

let port = process.env.PORT || 8000;
let petsPath = path.join(__dirname, "pets.json");

let server = http.createServer(function(req, res) {
  if (req.method === "GET" && req.url === "/pets") {
    fs.readFile(petsPath, "utf8", function(err, petsJSON) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }
      res.setHeader("Content-Type", "application/json");
      res.end(petsJSON);
    })
  } else if (req.method === "GET" && req.url === "/pets/0") {
    fs.readFile(petsPath, "utf8", function(err, petsJSON) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }

      let pets = JSON.parse(petsJSON);
      let petJSON = JSON.stringify(pets[0]);

      res.setHeader("Content-Type", "application/json");
      res.end(petJSON);
    })
  } else if (req.method === "GET" && req.url === "/pets/1") {
    fs.readFile(petsPath, "utf8", function(err, petsJSON) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }

      let pets = JSON.parse(petsJSON);
      let petJSON = JSON.stringify(pets[1]);

      res.setHeader("Content-Type", "application/json");
      res.end(petJSON);
    })
  } else if (req.method === "POST" && req.url === "/pets") {

    let returnChunk = "";

    req.on("data", (chunk) => returnChunk += chunk.toString());

    req.on("end", function() {
      fs.readFile(petsPath, "utf8", function(err, petsJSON) {
        if (err) {
          console.error(err.stack);
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          return res.end("Internal Server Error");
        }

        let pets = JSON.parse(petsJSON);
        let body = JSON.parse(returnChunk);

        let age = Number.parseInt(body.age);
        let kind = body.kind;
        let name = body.name;

        if (Number.isNaN(age) || !kind || !name) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "text/plain");
          res.end("Bad Request");
          return;
        }

        let pet = {age, kind, name};
        pets.push(pet);

        let updatedPetsJSON = JSON.stringify(pets);
        let petJSON = JSON.stringify(pet);

        fs.writeFile(petsPath, updatedPetsJSON, function(err) {
          if (err) {
            console.error(err.stack);

            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            res.end("Internal Server Error");
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(petJSON);
        })
      })
    })
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(port, () => console.log(`Listening On Port ${port}`));

module.exports = server
