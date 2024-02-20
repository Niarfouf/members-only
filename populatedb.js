#! /usr/bin/env node

console.log(
  'This script populates some categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const itemDetails = {
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  };

  const item = new Item(itemDetails);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Screen",
      "A variety of screens in all sizes and quality to watch your favorite movies or play your favorite games."
    ),
    categoryCreate(
      1,
      "Keyboard",
      "The best keyboards of all types, being mechanical, optic or with membrane."
    ),
    categoryCreate(
      2,
      "Mouse",
      "Every types of mice are available for work, gaming etc..."
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "Little",
      "A little screen is enough sometimes when space is needed somehow",
      categories[0],
      49.99,
      5
    ),
    itemCreate(
      1,
      "Medium",
      "A medium screen is the go to if you are unable to chose between small and wide",
      categories[0],
      99.99,
      10
    ),
    itemCreate(
      2,
      "Wide",
      "A wide screen because larger is always better and, he ho, why not",
      categories[0],
      149.99,
      2
    ),
    itemCreate(
      3,
      "Mechanical",
      "The best keyboard to make some noise and upset your neighbors",
      categories[1],
      70.0,
      0
    ),
    itemCreate(
      4,
      "Optic",
      "A futuristic keyboard going the speed of light",
      categories[1],
      100.0,
      7
    ),
    itemCreate(
      5,
      "Membrane",
      "The good old one keyboard is sometimes enough",
      categories[1],
      50.0,
      12
    ),
    itemCreate(
      6,
      "WorkingOffice",
      "A mouse to work quickly and never fall asleep at the office",
      categories[2],
      65.48,
      8
    ),
    itemCreate(
      7,
      "Gaming",
      "The perfect mouse for gamers of all sorts, being MMORPG, FPS or RTS",
      categories[2],
      125.5,
      35
    ),
    itemCreate(
      8,
      "Simple",
      "A simple mouse is good because why pay more to do the same?",
      categories[2],
      30.0,
      2
    ),
  ]);
}
