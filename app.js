const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/WeCBRdb", {useNewUrlParser: true});


var qusArray = [];
const qusSchema = new mongoose.Schema({
  id: Number,
  usr: String,
  questionData : String,
  answerDataS: [String]
})
const ansSchema = new mongoose.Schema({
  usr: String,
  answerData : String
})

const qusData = mongoose.model("qusData", qusSchema);
const ansData = mongoose.model("ansData", ansSchema);
var i=0;
qusData.find({}, function(err, foundqus){
  if(foundqus.length === 0){i=0}
  else{i = foundqus.length;} });

var value=0 ;
app.get("/", function(req,res){
  qusData.find({}, function(err, foundqus){
    if(foundqus.length === 0){
      console.log("No questions found");
      res.sendFile(__dirname+"/index.html");
    }
    else{
      res.render("index", {questions: foundqus});
    }
  })
})


app.post("/", function(req,res){
  if(req.body.questionName){
  const qus1 = new qusData({
    id: i++,
    usr: "rohanjai77",
    questionData: req.body.questionName
  })
  qus1.save();
}
  else if(req.body.answerName){
    const ans1 = new ansData({
      usr: "rohanjai77",
      answerData: req.body.answerName
    })
    console.log(value);
    qusData.updateOne({ "id": value},{$push: {"answerDataS": req.body.answerName }},function (err) {
       if (err) {console.log(err);}
       else{console.log("Value Successfully Updated");}
   }
);
    ans1.save();
    console.log(req.body.submitAnswer);
  }
  res.redirect("/");
})


app.post("/question", function(req, res){
  res.sendFile(__dirname+"/question.html");
})

app.post("/answer", function(req,res){
  value = req.body.button;
  res.sendFile(__dirname+"/answer.html");
})

app.listen(3000, function(){
  console.log("Server started at port 3000");
})
// qusData.find({},function(err,questionsss){
//   if(err){console.log(err);}
//   else{
//     questionsss.forEach(function(i){
//       qusArray.push(i.questionData);
//     })
//     console.log(qusArray);
//   }
// })
// res.render("index",{questions: qusArray});


// <% for(var j=0;i<questions[i].answerDataS.length;j++){ %>
// <h2><%= questions[i].answerDataS[j]  %></h2>
// <% } %>
// <% } %>
