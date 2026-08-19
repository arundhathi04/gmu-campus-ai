import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // Ask the existing GMU backend
  const askQuestion = async (text = question, speak = false) => {
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

      // ONLY speak when the question came from voice
      if (speak && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(data.answer);
        speech.lang = "en-IN";
        speech.rate = 0.9;

        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      setAnswer(
        "⚠️ The campus assistant server is not connected. Please make sure the GMU backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Voice assistant
  const startVoiceAssistant = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice assistant works best in Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event) => {
      const spokenQuestion =
        event.results[0][0].transcript;

      setQuestion(spokenQuestion);

      // Voice question = answer on screen + speak answer
      askQuestion(spokenQuestion, true);
    };

    recognition.onerror = () => {
      setListening(false);
      setAnswer(
        "🎤 I couldn't hear that. Please try again."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
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
        <div className="logo">
          🎓 GMU Campus AI
        </div>

        <div className="assistant">
          Student Assistant
        </div>
      </header>

      <main className="main">

        <section className="hero">
          <h1>How can I help you?</h1>

          <p>
            Your intelligent campus assistant for GM University
          </p>
        </section>

        <section className="question-box">

          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
            placeholder="Ask about library, hostel, transport, admissions..."
          />

          {/* VOICE BUTTON */}
          <button
            type="button"
            className="voice-button"
            onClick={startVoiceAssistant}
          >
            {listening
              ? "🎤 Listening..."
              : "🎤"}
          </button>

          {/* NORMAL ASK BUTTON */}
          <button
            type="button"
            onClick={() => askQuestion()}
          >
            {loading
              ? "Thinking..."
              : "Ask AI"}
          </button>

        </section>

        {listening && (
          <div className="voice-status">
            🎤 Listening... Ask your question.
          </div>
        )}

        {answer && (
          <section className="answer-box">

            <h2>🤖 GMU AI</h2>

            <p>{answer}</p>

          </section>
        )}

        <section className="services">

          <h2>Campus Services</h2>

          <div className="cards">

            {quickQuestions.map(
              ([icon, title, query]) => (

                <button
                  type="button"
                  className="card"
                  key={title}
                  onClick={() =>
                    askQuestion(query)
                  }
                >

                  <span className="card-icon">
                    {icon}
                  </span>

                  <span>
                    {title}
                  </span>

                </button>

              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;