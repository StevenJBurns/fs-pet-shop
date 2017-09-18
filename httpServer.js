"use strict";

let http = require("http");
let path = require("path");
let url = require("url");
let fs = require("fs");

let port = process.env.PORT || 8000;
let pathToPetShop = path.join(__dirname, "pets.json");

const regexPetsPathname = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {

  switch (req.method) {
    case "GET" :
      handleGET(url.parse(req.url), res);
      break;

    case "POST" :
      handlePOST(url.parse(req.url), res);
      break;

    default :
      http.METHODS.includes(req.method) ? res.statusCode = 501 : res.statusCode = 400
      res.setHeader("Content-Type", "text/plain");
      http.METHODS.includes(req.method) ? res.end("Valid Method But Implemented On This Server") : res.end("Check your HTTP Method")
    }
  });


//   if (req.method === "GET" && req.url === "/pets") {
//     fs.readFile(petsPath, "utf8", function(err, petsJSON) {
//       if (err) {
//         console.error(err);
//         res.statusCode = 500;
//         res.setHeader("Content-Type", "text/plain");
//         return res.end("Internal Server Error");
//       }
//       res.setHeader("Content-Type", "application/json");
//       res.end(petsJSON);
//     })
//   } else if (req.method === "GET" && req.url === "/pets/0") {
//     fs.readFile(petsPath, "utf8", function(err, petsJSON) {
//       if (err) {
//         console.error(err);
//         res.statusCode = 500;
//         res.setHeader("Content-Type", "text/plain");
//         return res.end("Internal Server Error");
//       }
//
//       let pets = JSON.parse(petsJSON);
//       let petJSON = JSON.stringify(pets[0]);
//
//       res.setHeader("Content-Type", "application/json");
//       res.end(petJSON);
//     })
//   } else if (req.method === "GET" && req.url === "/pets/1") {
//     fs.readFile(petsPath, "utf8", function(err, petsJSON) {
//       if (err) {
//         console.error(err);
//         res.statusCode = 500;
//         res.setHeader("Content-Type", "text/plain");
//         return res.end("Internal Server Error");
//       }
//
//       let pets = JSON.parse(petsJSON);
//       let petJSON = JSON.stringify(pets[1]);
//
//       res.setHeader("Content-Type", "application/json");
//       res.end(petJSON);
//     })
//   } else if (req.method === "POST" && req.url === "/pets") {
//
//     let returnChunk = "";
//
//     req.on("data", (chunk) => returnChunk += chunk.toString());
//
//     req.on("end", function() {
//       fs.readFile(petsPath, "utf8", function(err, petsJSON) {
//         if (err) {
//           console.error(err.stack);
//           res.statusCode = 500;
//           res.setHeader("Content-Type", "text/plain");
//           return res.end("Internal Server Error");
//         }
//
//         let pets = JSON.parse(petsJSON);
//         let body = JSON.parse(returnChunk);
//
//         let age = Number.parseInt(body.age);
//         let kind = body.kind;
//         let name = body.name;
//
//         if (Number.isNaN(age) || !kind || !name) {
//           res.statusCode = 400;
//           res.setHeader("Content-Type", "text/plain");
//           res.end("Bad Request");
//           return;
//         }
//
//         let pet = {age, kind, name};
//         pets.push(pet);
//
//         let updatedPetsJSON = JSON.stringify(pets);
//         let petJSON = JSON.stringify(pet);
//
//         fs.writeFile(petsPath, updatedPetsJSON, function(err) {
//           if (err) {
//             console.error(err.stack);
//
//             res.statusCode = 500;
//             res.setHeader("Content-Type", "text/plain");
//             res.end("Internal Server Error");
//             return;
//           }
//
//           res.setHeader("Content-Type", "application/json");
//           res.end(petJSON);
//         })
//       })
//     })
//   } else {
//     res.statusCode = 404;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Not Found");
//   }
// });


function handleGET(reqUrl, res) {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) console.error(readError);

    // Test url.pathname against the regex and set statusCode as required
    regexPetsPathname.test(reqUrl.pathname) ? res.statusCode = 200 : () => res.statusCode = 404

    // get ALL the pets...
    let storedPets = JSON.parse(data);
    // break the pathname up into strings without the "/" symbols
    let pathnameSplit = reqUrl.pathname.split(path.sep);
    // remove the leading empty string after the split()... e.g. ["", "pets", "0"] -> ["pets, "0"]
    pathnameSplit.shift();

    if (!pathnameSplit[1]) {
      res.setHeader("Content-Type", "application/json");
      res.end(data);
    } else if (!storedPets[pathnameSplit[1]]) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Not Found");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(storedPets[pathnameSplit[1]]));
    }
  });
}

function handlePOST(reqURL, res) {
  fs.readFile(pathToPetShop, "utf8", (readError, petsJSON) => {
    if (readError) console.error(readError);

    let storedPets = JSON.parse(data);
  });
}

function handlePut (reqURL, res) {
  fs.readFile(pathToPetShop, "utf8", (readError, petsJSON) => {
    if (readError) console.error(readError);

    let storedPets = JSON.parse(data);
  });
}

function handleDELETE (reqURL, res) {
  fs.readFile(pathToPetShop, "utf8", (readError, petsJSON) => {
    if (readError) console.error(readError);

    let storedPets = JSON.parse(data);
  });
}

server.listen(port, () => console.log(`HTTP Server is running. Listening On Port ${port}`));

module.exports = server
