import express from "express";
import cors from "cors"
import { PrismaClient } from "@prisma/client";
import jwt, { decode } from "jsonwebtoken";

const secret_key = "pay_app";

const pay_app = express();
pay_app.use(express.json());
pay_app.use(cors());

const Prisma = new PrismaClient();


pay_app.post("/login", async (req, res) => {
    const { email, pass } = req.body;

    const user = await Prisma.user.findFirst({ where: { Email: email, Password: pass } });
    if (user) {
        const token = jwt.sign({ "user": user.Phone_no }, secret_key);
        return res.status(200).json({ token });

    } else {
        res.status(403);
    }
});


pay_app.post("/signup", async (req, res) => {
    const { Firstname,
        Lastname,
        Password,
        Balance,
        Phone_no,
        Email } = req.body;
    try {
        const user = await Prisma.user.create({
            data: {
                Firstname,
                Lastname,
                Password,
                Balance,
                Phone_no,
                Email
            }
        });

        res.status(200).json({
            status: "Success..."
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed To Create User..." })
    }
})

pay_app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send("unauthorized Token");
    } else {
        try {
            const user_details = jwt.verify(token, secret_key);
            req.userPhone = user_details.user;
            next();
        } catch (error) {
            res.status(403).send("unauthorized");
        }

    }
});

pay_app.post("/send_money", async (req, res) => {
    const FromPhone = parseInt(req.userPhone);
    const { ToPhone, Amount } = req.body;

    if (!FromPhone || !ToPhone || Amount <= 0) {
        return res.status(400).json({ message: 'Invalid Request' });
    }

    let transaction_sender;

    try {
        // Create the transaction with "Pending" status
        transaction_sender = await Prisma.transaction.create({
            data: {
                From: FromPhone,
                To: ToPhone,
                Status: "Pending",
                Amount: Amount
            }
        });

        //fetch both users
        const sender = await Prisma.user.findFirst({ where: { Phone_no: FromPhone } });
        const receiver = await Prisma.user.findFirst({ where: { Phone_no: ToPhone } });

        if (!sender || !receiver) {
            throw new Error('Sender or Receiver not found');
        }

        if (sender.Balance < Amount) {
            throw new Error('Insufficient balance');
        }

        // Perform money transfer in a transaction

        await Prisma.$transaction([
            Prisma.user.update({
                where: { id: sender.id },
                data: { Balance: { decrement: Amount } }
            }),
            Prisma.user.update({
                where: { id: receiver.id },
                data: { Balance: { increment: Amount } }
            }),
            Prisma.transaction.update({
                where: { id: transaction_sender.id },
                data: { Status: "Completed" }
            })
        ]);


        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Payment_Error', err);

        // If transaction_sender failed
        if (transaction_sender) {
            await Prisma.transaction.update({
                where: { id: transaction_sender.id },
                data: { Status: "Failed" }
            });
        }

        return res.send(err.message).status(500);
    }
});


pay_app.post("/balance", async (req, res) => {
    const Phone = req.userPhone;

    try {
        const user_phone = await Prisma.user.findFirst({
            where: { Phone_no: Phone }
        });

        if (!user_phone) {
            return res.status(404).json({ error: "User not found !!!" });
        }

        res.status(200).json({ Balance: user_phone.Balance });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Balance Error" });
    }
});



pay_app.post("/tran_his", async (req, res) => {
    const phone = req.userPhone;
    try {
        const tran_his = await Prisma.transaction.findMany({ where: { From: parseInt(phone) }, orderBy: { TransactionDate: 'desc' } });
        res.status(200).json({ tran_his });
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: "Transaction not Found !!" })
    }
})

pay_app.post("/search_user", async (req, res) => {
    const { mobile } = req.body;

    try {
        if (req.userPhone === parseInt(mobile)) {
            return res.status(400).json({ err: "Self transactions are not allowed" });
        }
        const user = await Prisma.user.findFirst({ where: { Phone_no: parseInt(mobile) } });
        res.status(200).json({ user });
    } catch (err) {
        // console.log(err);
        res.status(404).json({ err: "User Not Found !!!" });
    }
});


pay_app.listen(3000, "0.0.0.0", () => {
    console.log("Server Running at 3000 PORT !!!!");
})