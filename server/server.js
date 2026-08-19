const express = require("express");
const cors = require("cors");
const campusData = require("./campusData");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "GMU Campus AI backend is running!"
  });
});

app.post("/ask", (req, res) => {
  const question = req.body.question.toLowerCase();

  let answer =
    "🤖 I couldn't find that information. Please try asking about the library, hostel, admission, transport, canteen, offices or campus.";

  // Library
  if (question.includes("library")) {
    if (
      question.includes("where") ||
      question.includes("location") ||
      question.includes("located")
    ) {
      answer = `📍 ${campusData.library.location}`;
    } else if (
      question.includes("time") ||
      question.includes("open") ||
      question.includes("close")
    ) {
      answer = `⏰ ${campusData.library.timings}`;
    } else if (
      question.includes("borrow") ||
      question.includes("book")
    ) {
      answer = `📚 ${campusData.library.books} ${campusData.library.borrowing} ${campusData.library.duration}`;
    } else if (question.includes("read")) {
      answer = `📖 ${campusData.library.readingHall}`;
    } else {
      answer = `📚 ${campusData.library.books}`;
    }
  }

  // Admission
  else if (
    question.includes("admission") ||
    question.includes("fee") ||
    question.includes("payment") ||
    question.includes("grievance")
  ) {
    answer = `🏢 ${campusData.admission.location} ${campusData.admission.services} ${campusData.admission.timings}`;
  }

  // Hostel
  else if (question.includes("hostel")) {
    if (question.includes("girl")) {
      answer = `🏠 ${campusData.hostel.girls}`;
    } else if (question.includes("boy")) {
      answer = `🏠 ${campusData.hostel.boys}`;
    } else if (
      question.includes("facility") ||
      question.includes("facilities")
    ) {
      answer = `🏠 ${campusData.hostel.facilities}`;
    } else if (
      question.includes("time") ||
      question.includes("gate")
    ) {
      answer = `⏰ ${campusData.hostel.timings}`;
    } else {
      answer = `🏠 ${campusData.hostel.girls} ${campusData.hostel.boys}`;
    }
  }

  // Transport
  else if (
    question.includes("bus") ||
    question.includes("transport")
  ) {
    answer = `🚌 ${campusData.transport.information}`;
  }

  // Food
  else if (
    question.includes("canteen") ||
    question.includes("food")
  ) {
    answer = `🍴 ${campusData.food.canteen}`;
  }

  // Bakery
  else if (question.includes("bakery")) {
    answer = `🥐 ${campusData.food.bakery}`;
  }

  // Principal
  else if (question.includes("principal")) {
    answer = `🏢 ${campusData.offices.principal}`;
  }

  // VC
  else if (
    question.includes("vc") ||
    question.includes("vice chancellor")
  ) {
    answer = `🏢 ${campusData.offices.vc}`;
  }

  // Exam
  else if (
    question.includes("exam") ||
    question.includes("examination")
  ) {
    answer = `📝 ${campusData.offices.exam}`;
  }

  // Campus
  else if (
    question.includes("campus") ||
    question.includes("building") ||
    question.includes("block")
  ) {
    answer = `🏫 ${campusData.campus.blocks} ${campusData.campus.facilities}`;
  }

  res.json({ answer });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `GMU Campus AI server running on http://localhost:${PORT}`
  );
});