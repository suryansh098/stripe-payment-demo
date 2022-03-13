const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
// TODO: add a stripe secret key in .env file
const KEY = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(KEY);
const { v4: uuid } = require("uuid");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.json({ status: "Success", message: "Server Online!" });
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT: ", product);
  console.log("PRICE: ", product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Your purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen
app.listen(5000, () => {
  console.log("App is running at PORT:5000");
});
