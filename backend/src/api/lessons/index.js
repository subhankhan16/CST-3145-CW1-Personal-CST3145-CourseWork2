const { MongoClient } = require("mongodb");
const { Router } = require("express");
const config = require("../../utils/config");

// initialize mongodb client
const client = new MongoClient(config.db);
// connect to databse
const database = client.db("subhan");
// connect to lessons collection
const lessons = database.collection("lessons");

const router = Router();

// the api responsible for GET lessons
router.get("/", (req, res) => {
  // get query variables passed to this api from url
  const { sortValue, sortBy, searchText } = req.query;

  const query = [];

  // if theres is sorting variables passed to backend
  // 1 for ascending sort
  // -1 for desending sort
  if (sortValue) {
    query.push({ $sort: { [`${sortValue}`]: parseInt(sortBy) } });
  }

  // if theres is searchText in query
  // we search for the value of searchText for subject, location, price and quantity fields
  if (searchText) {
    const operations = [];
    // if searchText can be a number do mongodb operation that related to numbers only
    // if it can not be a number do string operations
    const checkSearchText = Number.parseInt(searchText);
    if (!Number.isNaN(checkSearchText)) {
      operations.push({ price: Number.parseInt(searchText) });
    }

    if (!Number.isNaN(checkSearchText)) {
      operations.push({ quantity: Number.parseInt(searchText) });
    }

    if (Number.isNaN(checkSearchText)) {
      operations.push(
        { subject: { $regex: `${searchText}`, $options: "i" } },
        { location: { $regex: `${searchText}`, $options: "i" } }
      );
    }

    // the final mongodb query value
    query.push({
      $match: { $or: operations },
    });
  }

  // executing mongodb query to fetch the data from mongodb atlas
  // and convert it to array and return it as json
  lessons
    .aggregate(query)
    .toArray()
    .then((data) => res.json(data));
});

module.exports = router;
