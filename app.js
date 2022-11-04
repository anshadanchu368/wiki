const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save(function (err) {
      if (!err) {
        res.send("successfully saved article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully deleted article");
      } else {
        res.send(err);
      }
    });
  });

///////////////////specific articles////////////////////////////    //////////////////////////////////

app.route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send("article not found");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      {overwrite: true},
      function (err) {
        if (!err) {
            res.send("updated successfully");
        }else{
            res.send(err);
                    console.log(err);
    }});
  })

  .patch(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      {$set:{title:"hello there"}},
      function (err) {
        if (!err) {
            res.send("updated successfully");
        }else{
            res.send(err);
                    console.log(err);
        }
        }       
      );
    })

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
