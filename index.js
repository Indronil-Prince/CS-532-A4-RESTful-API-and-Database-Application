const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to Database!'));
// Define a schema for the documents in the collection
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const mySchema = new Schema({
      id: ObjectId,
      name: String,
      age: Number,
      date: Date,
      position: String,
      teamId: { type: Schema.Types.ObjectId, ref: 'teams' },
    });

const teamSchema = new Schema({
      teamname: { type: String, required: true },
      country: { type: String, required: true },
    });

    mySchema.statics.listAllPlayers = function() {
      return this.find({}).populate('teamId');
  };
  teamSchema.statics.listAllTeams = function() {
    return this.find({});
};
  
  var myModel = mongoose.model('players', mySchema);
  var teamModel = mongoose.model('teams', teamSchema);
  // myModel.listAllPlayers().then(function(data) {
  //   console.log("My data: " + data);
  // });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the upload form
app.get('/upload', (req, res) => {
  teamModel.listAllTeams().then(function(data){
    res.render('upload.ejs', { teams: data });
  });
});

// Handle the POST request from the upload form
app.post('/upload', (req, res) => {
  if(req.body.teams==="Others"){
    const myDoc1 = new teamModel({
      teamname: req.body.teamname,
      country: req.body.country
    });
    myDoc1.save().then(function(data){
      const myDoc = new myModel({
        name: req.body.name,
        age: req.body.age,
        date: new Date(req.body.date),
        position: req.body.position,
        teamId: data._id
    });
    myDoc.save().then(function(data){
      if (data) {
        console.log(data);
        console.log('Document saved to database');
        res.redirect('/list');
      }
    });
  });
}
  else{
  const myDoc = new myModel({
    name: req.body.name,
    age: req.body.age,
    date: new Date(req.body.date),
    position: req.body.position,
    teamId: req.body.teams});
  
  // Save the new document to the collection
  myDoc.save().then(function(data){
    if (data) {
      console.log(data);
      console.log('Document saved to database');
      res.redirect('/list');
    }
  });
}
});

// Serve the list page with all the documents in the collection
app.get('/list', (req, res) => {
  myModel.listAllPlayers().then(function(data){
    res.render('list.ejs', { documents: data });
  });
});

app.get('/query', (req, res) => {
  if(!(req.query.agelessthan===undefined)){
  const age = parseInt(req.query.agelessthan);
  myModel.find({ age: { $lt: age } }).populate('teamId')
  .sort({ age: 'asc' })
  .exec((err, results) => {
    if (err) {
      res.render('query.ejs');
    } else {
      res.json(results);
    }
  });}

  else if(!(req.query.agegreaterthan===undefined)){
  const age = parseInt(req.query.agegreaterthan);
  myModel.find({ age: { $gt: age } }).populate('teamId')
    .sort({ age: 'asc' })
    .exec((err, results) => {
      if (err) {
        res.render('query.ejs');
      } else {
        res.json(results);
      }
    });}
  
  else{
    const age = parseInt(req.query.ageequalto);
    myModel.find({ age: { $eq: age } }).populate('teamId')
    .exec((err, results) => {
      if (err) { 
        res.render('query.ejs'); 
      } else { 
        res.json(results); 
      }
    });}
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
