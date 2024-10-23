import express, { Request, Response } from "express";
import db from "@repo/db";
const app = express();

app.use(express.json()); // Add this line to parse JSON request bodies

app.post("/hdfcWebhook", async(req: Request, res: Response) => {
  //TODO: Add zod validation here?
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  // Update balance in db, add txn
 await db.balance.update({
    where: {
      userId: paymentInformation.userId,
    },
    data: {
      amount: {
        increment: paymentInformation.amount,
      },
    },
  });

  await db.onRampTransaction.update({
    where:{
        token:paymentInformation.token
    },
    data:{
        status:"Success",
    }
  })

  // Send a response
  res.status(200).json({ message: "Webhook received successfully" });
});

// Add a listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
