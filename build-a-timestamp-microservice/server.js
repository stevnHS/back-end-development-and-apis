import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

app.get("/api{/:date}", (req, res) => {
  const { date: date_string } = req.params;

  let date;
  if (!date_string) {
    date = new Date();
  } else if (!isNaN(date_string)) {
    date = new Date(Number(date_string));
  } else {
    date = new Date(date_string);
  }

  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
})

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
