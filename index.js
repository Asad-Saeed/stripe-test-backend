const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Endpoint to create customer
app.post("/api/create-customer", async (req, res) => {
  const { email, name } = req.body;

  try {
    const customer = await stripe.customers.create({ email, name });
    res.json(customer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to retrieve customer
app.get("/api/customer/:id", async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await stripe.customers.retrieve(customerId);
    res.json(customer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to retrieve payment methods
app.get("/api/payment-methods/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
    res.json(paymentMethods.data);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
