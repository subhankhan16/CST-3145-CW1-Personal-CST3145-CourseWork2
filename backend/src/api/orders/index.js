const { MongoClient } = require("mongodb");
const { Router } = require("express");
const config = require("../../utils/config");

const client = new MongoClient(config.db);
const database = client.db("subhan");
const orders = database.collection("orders");
const lessons = database.collection("lessons");

const router = Router();
// this api for order checkout
router.post("/", async (req, res) => {
  // we fetch lesson id and lesson quantity
  const { id, quantity } = req.body;

  // 1. subsctract order quantity from lesson quantity
  lessons
    .updateOne(
      {
        _id: id,
      },
      {
        $set: {
          $inc: { availableInventory: -quantity },
        },
      }
    )
    // 2. store order data in database
    .then((data) => {
      return orders.insertOne({
        lessonId: id,
        quantity,
      });
    })
    // 3. return that order is success
    .then(() => res.json({ message: "Sucessfully Submitted" }));
});

module.exports = router;
