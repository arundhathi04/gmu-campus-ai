import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (text = question) => {
    const q = text.trim();

    if (!q) {
      setAnswer("Please enter a question.");
      return;
    }

    setQuestion(q);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: q }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer(
        "⚠️ The campus assistant server is not connected. Please make sure the GMU backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    ["📚", "Library", "Where is the library?"],
    ["🏠", "Hostel", "What hostel facilities are available?"],
    ["🎓", "Admissions", "Where is the admission office?"],
    ["🚌", "Transport", "Tell me about campus transport."],
    ["🍴", "Canteen", "Where is the canteen?"],
    ["📝", "Examinations", "Where is the examination office?"],
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🎓 GMU Campus AI</div>
        <div className="assistant">Student Assistant</div>
      </header>

      <main className="main">
        <section className="hero">
          <h1>How can I help you?</h1>
          <p>Your intelligent campus assistant for GM University</p>
        </section>

        <section className="question-box">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") askQuestion();
            }}
            placeholder="Ask about library, hostel, transport, admissions..."
          />

          <button onClick={() => askQuestion()}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </section>

        {answer && (
          <section className="answer-box">
            <h2>🤖 GMU AI</h2>
            <p>{answer}</p>
          </section>
        )}

        <section className="services">
          <h2>Campus Services</h2>

          <div className="cards">
            {quickQuestions.map(([icon, title, query]) => (
              <button
                className="card"
                key={title}
                onClick={() => askQuestion(query)}
              >
                <span className="card-icon">{icon}</span>
                <span>{title}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;