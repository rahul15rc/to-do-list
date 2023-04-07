const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-rahul:test123@cluster0.453onnm.mongodb.net/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to-do list!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-US", options);
  Item.find({}).then((foundItems) => {
    if (!foundItems.length) {
      Item.insertMany(defaultItems)
        .then(function () {
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    Item.find({}).then((foundItems) => {
      res.render("list", { listTitle: day, newListItems: foundItems });
    });
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId)
    .then(() => {
        res.redirect("/");
    })
    .catch((err) => {
        console.log(err);
    })
});

app.listen(process.env.PORT, function () {
  console.log("Server started.");
});
