const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const plan = req.body.plan;

  let price;
  if (plan === "basic") price = 0;
  if (plan === "premium") price = 499;   // $4.99 en centavos
  if (plan === "corporate") price = 999; // $9.99 en centavos

  if (price === 0) {
    return res.json({ free: true });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${plan} Plan` },
          unit_amount: price,
        },
        quantity: 1,
      }],
      mode: "subscription", // o "payment"
      success_url: "https://jmely19.github.io/savewave/success.html",
      cancel_url: "https://jmely19.github.io/savewave/cancel.html",
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("Servidor corriendo en http://localhost:4242"));
