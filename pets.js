"use strict";

let fs = require("fs");
let path = require("path");

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];

let pathToPetShop = path.join("/Users/sjb/GitHub/Galvanize/Q2/fs-pet-shop", "pets.json");

switch (cmd) {
  case "create" :
    createPetRecord();
    break;

  case "read" :
    readPetRecord(process.argv[3]);
    break;

  case "update" :
    updatePetRecord();
    break;

  case "destroy" :
    destroyPetRecord();
    break;

  default :
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exitCode = 1;
}

function createPetRecord() {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) throw readError;

    let newPet = {age: Number(process.argv[3]), kind: process.argv[4], name: process.argv[5]};
    let storedPets = JSON.parse(data);

    if(!newPet.age || !newPet.kind || !newPet.name) {
      console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
      process.exit(1);
    } else {
      storedPets.push(newPet);
      fs.writeFile(pathToPetShop, JSON.stringify(storedPets), (writeError) => writeError ? console.error(writeError) : console.log(newPet));
    }
  });
}

function readPetRecord(requestedIndex) {
  fs.readFile(pathToPetShop, "utf8", (readError, data) => {
    if (readError) throw readError;

    let storedPets = JSON.parse(data);

    for (let pet of storedPets) {
      if (storedPets[requestedIndex]) {
        console.log(storedPets[requestedIndex]);
        return;
      } else if (!requestedIndex) {
        console.log(storedPets);
        return;
      } else {
        console.error(`Usage: ${node} ${file} read INDEX`);
        process.exit(1);
      }
    }
  });
}

function updatePetRecord() {

}

function destroyPetRecord() {

}
