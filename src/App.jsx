import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [showCourses, setShowCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
  };

  
  const askQuestion = async (
    text = question,
    speakAnswer = false
  ) => {
    const q = text.trim();

    if (!q) {
      setAnswer("Please enter a question.");
      return;
    }

    setQuestion(q);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: q,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setAnswer(data.answer);

      if (speakAnswer) {
        speak(data.answer);
      }
    } catch (error) {
      setAnswer(
        "⚠️ The campus assistant server is not connected. Please make sure the GMU backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

 
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

  const services = [
    {
      icon: "📚",
      title: "Library",
      description:
        "The Central Library is located at the centre of the campus and is easily accessible from the surrounding academic buildings.",
      points: [
        "Central campus location",
        "Books and academic resources",
        "Reading and study facilities",
        "Digital learning resources",
        "Reference materials",
      ],
    },

    {
      icon: "🏠",
      title: "Hostel",
      description:
        "GM University provides hostel facilities to support students with convenient accommodation and campus living.",
      points: [
        "Hostel accommodation",
        "Student living facilities",
        "Hostel support services",
        "Essential student facilities",
        "Hostel timings and regulations",
      ],
    },

    {
      icon: "🎓",
      title: "Admissions",
      description:
        "The Admission Office assists students with admission-related services, applications and guidance.",
      points: [
        "Admission guidance",
        "Application support",
        "Fee-related services",
        "Payment assistance",
        "Student grievance assistance",
      ],
    },

    {
      icon: "🚌",
      title: "Transport",
      description:
        "Campus transport facilities help students and staff travel conveniently to and from the university.",
      points: [
        "Campus transportation",
        "Student travel support",
        "Bus information",
        "Transport assistance",
        "Route information",
      ],
    },

    {
      icon: "🍴",
      title: "Food & Canteen",
      description:
        "Students can access campus food facilities including the canteen and bakery.",
      points: [
        "Campus canteen",
        "Food and refreshments",
        "Bakery facilities",
        "Student food services",
        "Daily refreshments",
      ],
    },

    {
      icon: "📝",
      title: "Examinations",
      description:
        "The Examination Office provides examination-related information and academic assessment support.",
      points: [
        "Examination information",
        "Exam-related assistance",
        "Academic assessment support",
        "Examination office services",
        "Student examination guidance",
      ],
    },

    {
      icon: "🏫",
      title: "Campus",
      description:
        "GM University brings together academic buildings, administrative offices, student facilities and important services.",
      points: [
        "Academic buildings",
        "Administrative offices",
        "Student facilities",
        "Important campus blocks",
        "Academic services",
      ],
    },
  ];

  const courses = [
    {
      icon: "⚙️",
      name: "B.Tech",
      title: "Bachelor of Technology",
      description:
        "An undergraduate technology and engineering program focused on technical knowledge, practical skills and problem solving.",
      branches: [
        "Computer Science and Engineering",
        "Artificial Intelligence and Machine Learning",
        "Electronics and Communication Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
      ],
    },

    {
      icon: "💻",
      name: "BCA",
      title: "Bachelor of Computer Applications",
      description:
        "An undergraduate program focused on computer applications, programming, software and information technology.",
      branches: [
        "Computer Applications",
        "Information Technology",
        "Computer Science",
      ],
    },

    {
      icon: "🖥️",
      name: "MCA",
      title: "Master of Computer Applications",
      description:
        "A postgraduate program focused on advanced computer applications, software development and information technology.",
      branches: [
        "Computer Applications",
        "Software Development",
        "Information Technology",
      ],
    },

    {
      icon: "🔧",
      name: "M.Tech",
      title: "Master of Technology",
      description:
        "A postgraduate technology program designed for advanced learning in engineering and technology.",
      branches: [
        "Computer Science and Engineering",
        "Artificial Intelligence",
        "Electronics and Communication",
        "Other Technology Specializations",
      ],
    },

    {
      icon: "📐",
      name: "BSE",
      title: "BSE",
      description:
        "An undergraduate program providing academic and practical learning in the relevant area of study.",
      branches: [
        "Science and related disciplines",
        "Subject-specific study",
      ],
    },

    {
      icon: "🔬",
      name: "MSE",
      title: "MSE",
      description:
        "A postgraduate program focused on advanced academic learning and deeper subject knowledge.",
      branches: [
        "Advanced subject study",
        "Science and related disciplines",
      ],
    },

    {
      icon: "📊",
      name: "BBA",
      title: "Bachelor of Business Administration",
      description:
        "An undergraduate business program introducing students to management, business practices and organizational concepts.",
      branches: [
        "Business Management",
        "Marketing",
        "Finance",
        "Human Resource Management",
        "Entrepreneurship",
      ],
    },

    {
      icon: "💊",
      name: "B.Pharm",
      title: "Bachelor of Pharmacy",
      description:
        "An undergraduate pharmacy program covering academic and practical learning related to pharmaceutical sciences.",
      branches: [
        "Pharmaceutical Sciences",
        "Pharmacy Practice",
      ],
    },

    {
      icon: "⚖️",
      name: "Law",
      title: "Law Programs",
      description:
        "Law education develops understanding of legal concepts, rights, responsibilities and the legal system.",
      branches: [
        "Legal Studies",
        "Constitutional Law",
        "Civil Law",
        "Criminal Law",
      ],
    },

    {
      icon: "🛠️",
      name: "Diploma",
      title: "Diploma Programs",
      description:
        "Diploma programs provide focused academic and practical education in the relevant area of study.",
      branches: [
        "Technical Diploma Programs",
        "Practical Skill Development",
        "Career-focused Education",
      ],
    },

    {
      icon: "🎒",
      name: "PU",
      title: "Pre-University",
      description:
        "PU education provides foundational academic preparation before students enter higher education.",
      branches: [
        "Science",
        "Commerce",
        "Arts",
      ],
    },
  ];

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          🎓 GMU Campus AI
        </div>

        <div className="assistant">
          Student Assistant
        </div>

      </header>

      <main className="main">

        {/* HERO */}
        <section className="hero">

          <h1>
            How can I help you?
          </h1>

          <p>
            Your intelligent campus assistant
            for GM University
          </p>

        </section>

        {/* AI SEARCH */}
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
            placeholder="Ask about library, hostel, courses, transport..."
          />

          <button
            type="button"
            className="voice-button"
            onClick={startVoiceAssistant}
          >
            {listening
              ? "🎤 Listening..."
              : "🎤"}
          </button>

          <button
            type="button"
            onClick={() => askQuestion()}
          >
            {loading
              ? "Thinking..."
              : "Ask AI"}
          </button>

        </section>

        {/* VOICE STATUS */}
        {listening && (
          <div className="voice-status">
            🎤 Listening... Ask your question.
          </div>
        )}

        {/* AI ANSWER */}
        {answer && (
          <section className="answer-box">

            <h2>🤖 GMU AI</h2>

            <p>{answer}</p>

          </section>
        )}

        {/* CAMPUS SERVICES */}
        <section className="services">

          <h2>
            Explore Campus
          </h2>

          <p className="section-description">
            Explore university facilities and
            student services.
          </p>

          <div className="cards">

            {services.map((service) => (

              <button
                type="button"
                className="card"
                key={service.title}
                onClick={() =>
                  setSelectedService(service)
                }
              >

                <span className="card-icon">
                  {service.icon}
                </span>

                <strong>
                  {service.title}
                </strong>

              </button>

            ))}

          </div>

        </section>

        {/* COURSES */}
        <section className="courses-section">

          <div className="courses-heading">

            <div>

              <h2>
                🎓 Courses
              </h2>

              <p>
                Explore programs and their
                available areas of study.
              </p>

            </div>

            <button
              type="button"
              className="courses-button"
              onClick={() =>
                setShowCourses(!showCourses)
              }
            >
              {showCourses
                ? "Hide Courses"
                : "View Courses"}
            </button>

          </div>

          {showCourses && (

            <div className="course-grid">

              {courses.map((course) => (

                <button
                  type="button"
                  className="course-card"
                  key={course.name}
                  onClick={() =>
                    setSelectedCourse(course)
                  }
                >

                  <div className="course-icon">
                    {course.icon}
                  </div>

                  <h3>
                    {course.name}
                  </h3>

                  <h4>
                    {course.title}
                  </h4>

                  <p>
                    {course.description}
                  </p>

                  <span className="course-more">
                    View branches →
                  </span>

                </button>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* CAMPUS SERVICE MODAL */}
      {selectedService && (

        <div
          className="service-overlay"
          onClick={() =>
            setSelectedService(null)
          }
        >

          <div
            className="service-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedService(null)
              }
            >
              ✕
            </button>

            <div className="modal-icon">
              {selectedService.icon}
            </div>

            <h2>
              {selectedService.title}
            </h2>

            <p>
              {selectedService.description}
            </p>

            <div className="info-list">

              {selectedService.points.map(
                (point) => (

                  <div
                    className="info-item"
                    key={point}
                  >

                    <span>✓</span>

                    {point}

                  </div>

                )
              )}

            </div>

            <button
              type="button"
              className="modal-ask"
              onClick={() => {

                askQuestion(
                  `Tell me about ${selectedService.title}`
                );

                setSelectedService(null);

              }}
            >
              🤖 Ask GMU AI
            </button>

          </div>

        </div>

      )}

      {/* COURSE MODAL */}
      {selectedCourse && (

        <div
          className="service-overlay"
          onClick={() =>
            setSelectedCourse(null)
          }
        >

          <div
            className="service-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedCourse(null)
              }
            >
              ✕
            </button>

            <div className="modal-icon">
              {selectedCourse.icon}
            </div>

            <h2>
              {selectedCourse.name}
            </h2>

            <h3>
              {selectedCourse.title}
            </h3>

            <p>
              {selectedCourse.description}
            </p>

            <h3>
              Available Branches / Areas
            </h3>

            <div className="info-list">

              {selectedCourse.branches.map(
                (branch) => (

                  <div
                    className="info-item"
                    key={branch}
                  >

                    <span>✓</span>

                    {branch}

                  </div>

                )
              )}

            </div>

            <button
              type="button"
              className="modal-ask"
              onClick={() => {

                askQuestion(
                  `Tell me about ${selectedCourse.name}`
                );

                setSelectedCourse(null);

              }}
            >
              🤖 Ask GMU AI
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
