"use strict";

let http = require("http");
let path = require("path");
let url = require("url");
let fs = require("fs");

let port = process.env.PORT || 8000;
let pathToPetShop = path.join(__dirname, "pets.json");

const regexPetsPathname = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {
  // get the url path and then its pathname
  let urlParsed = url.parse(req.url);
  let pathnameParsed = urlParsed.pathname;

  // Remove "/" characters then remove the leading empty string after the split()... e.g. ["", "pets", "0"] -> ["pets, "0"]
  pathnameParsed = urlParsed.pathname.split(path.sep);
  pathnameParsed.shift();

  // If you arent looking for the pets path, you're in the wrong app
  if (pathnameParsed[0] != "pets") return sendError404(res);

  switch (req.method) {
    case "GET" :
      handleGET(res, pathnameParsed[1]);
      break;

    case "POST" :
      handlePOST(req, res);
      break;

    default :
      sendError400(res);
    }
  });

function sendError400(res) {
  res.writeHead(400, {"Content-Type" : "text/plain"});
  res.end("Bad Request");
}

function sendError404(res) {
  res.writeHead(404, {"Content-Type" : "text/plain"});
  res.end("Not Found");
}

function sendError500(res, error) {
  console.error(console.error(error));
  res.writeHead(500, {"Content-Type" : "text/plain"});
  res.end("Internal Server Error");
}

function handleGET(res, requestedIndex) {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) sendError500(res, readError);

    let storedPets = JSON.parse(data);  // get ALL the pets...

    if (requestedIndex < 0 || requestedIndex > (storedPets.length - 1)) {
      sendError404(res);
    } else if (requestedIndex === undefined) {
      res.writeHead(200, {"Content-Type" : "application/json"});
      res.end(JSON.stringify(storedPets));
    } else {
      res.writeHead(200, {"Content-Type" : "application/json"});
      res.end(JSON.stringify(storedPets[requestedIndex]));
    }
  });
}

function handlePOST(req, res) {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) sendError500(res, readError);

    let completeChunk = "";

    req.on("data", (chunk) => completeChunk += chunk.toString());
    req.on("end", () => {
      fs.readFile(pathToPetShop, "utf8", (readError, data) => {
        if (readError) sendError500(res, readError);

        let storedPets = JSON.parse(data);  // get ALL the pets...
        let newPet = JSON.parse(completeChunk);

        if (!newPet["age"] || !newPet["kind"] || !newPet["name"]) sendError400(res);

        storedPets.push(newPet);

        fs.writeFile(pathToPetShop, JSON.stringify(storedPets), (writeError) => {
          if (writeError) sendError500(res, writeError);

          res.writeHead(200, {"Content-Type" : "application/json"});
          res.end(JSON.stringify(newPet));
        });
      });
    });
  });
}

function handlePut (response, reqURL) {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) sendError500(res, readError);

    let storedPets = JSON.parse(data);
  });
}

function handleDELETE (response, reqURL) {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) sendError500(res, readError);

    let storedPets = JSON.parse(data);
  });
}

server.listen(port, () => console.log(`HTTP Server is running. Listening On Port ${port}`));

module.exports = server;
