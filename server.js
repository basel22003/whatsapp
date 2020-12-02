// importing
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import express, { request, response } from "express";
import Pusher from "pusher";
import cors from "cors";
import path from "path";

// app config
const app = express();
const PORT = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1114963",
  key: "71cb125548a1bc6d30ca",
  secret: "b0e7d14a1804d4016828",
  cluster: "eu",
  useTLS: true,
});

// middleware

app.use(express.json());
app.use(cors());

// DB config

const connect_url =
  "mongodb+srv://admin:oPLed9KYklSemuBX@cluster0.kmak3.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI || connect_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// ????

const db = mongoose.connection;

db.once("open", () => {
  console.log("db is conncted:");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

// api routes
app.get("/", (request, response) => res.status(200).send("Hello World"));

app.get("/messages/sync", (request, response) => {
  Messages.find((error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(data);
    }
  });
});

app.post("/messages/new", (request, response) => {
  const dbMessage = request.body;

  Messages.create(dbMessage, (error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(201).send(data);
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("whatsapp-mern/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "whatsapp-mern", "build", "index.html")); // relative path
  });
}

// listen
app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
