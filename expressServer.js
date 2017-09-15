let fs = require("fs");
let path = require("path");
let express = require("express");

let app = express();
let port = process.env.PORT || 8000;
let petsPath = path.join(__dirname, "pets.json");

app.disable("x-powered-by");

app.get("/pets", function(req, res) {
  fs.readFile(petsPath, "utf8", function (err, petsJSON) {
    if(err){
      console.error(err.stack);
      res.sendStatus(500);
    }
    res.send(JSON.parse(petsJSON));
  });
});

app.get("/pets/:id", function(req, res){
  fs.readFile(petsPath, "utf8", function(err, petsJSON) {
    if(err) {
      console.error(err.stack);
      res.sendStatus(500);
    }

    let id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
      }

      res.set("Content-Type", "application/json");
      res.send(pets[id]);
  })
})

app.use(function(req, res) {
  res.sendStatus(404);
})

app.listen(port, () => console.log('Listening...'));

module.exports = app;
