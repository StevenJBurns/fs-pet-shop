'use strict';

let fs = require('fs');
let path = require('path');

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];
let petsPath = path.join("/Users/sjb/GitHub/Galvanize/Q2/fs-pet-shop", "pets.json");

switch (cmd) {
  case "read" :
    let index = process.argv[3];

    if (!index) {
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        }
        console.log(JSON.parse(data));
      });
    } else {
      let indexIncluded = false;

      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        }
        let pets = JSON.parse(data);
        for (let i in pets) {
          if (Number(index) === Number(i)) {
            console.log(pets[i]);
            indexIncluded = true;
          }
        }
        if(indexIncluded === false) {
          console.error(`Usage: ${node} ${file} read INDEX`);
          process.exitCode = 1;
        }
      });
    }
    break;
  case "create" :
    fs.readFile(petsPath, 'utf8', function(readErr, data){
      if (readErr) {
        throw readErr;
      }

      let newPet = {};
      let age = (newPet.age = Number(process.argv[3]));
      let kind = (newPet.kind = process.argv[4]);
      let name = (newPet.name = process.argv[5]);
      let pets = JSON.parse(data);

      if(!age || !kind || !name) {
        console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
        process.exit(1);
        }
        pets.push(newPet);

        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, function(writeErr){
          if (writeErr) {
            throw writeErr;
          }
          console.log(newPet);
        });
    });
    break;
  default :
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exitCode = 1;
}
