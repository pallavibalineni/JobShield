import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [authMessage, setAuthMessage] = useState("");

  const [verifyData, setVerifyData] = useState({
    company: "",
    title: "",
    url: "",
    recruiterEmail: "",
  });

  const [result, setResult] = useState(null);

  const [reportData, setReportData] = useState({
    company: "",
    title: "",
    url: "",
    reason: "",
  });

  const [reportMessage, setReportMessage] = useState("");

  const [searchText, setSearchText] = useState("");

  const opportunities = [
    {
      company: "TCS",
      title: "Data Analyst Internship",
      risk: "Low Risk",
      score: 0,
    },
    {
      company: "ABC Career Solutions",
      title: "Work From Home Data Entry Internship",
      risk: "Medium Risk",
      score: 20,
    },
    {
      company: "Infosys",
      title: "Data Science Internship",
      risk: "Low Risk",
      score: 0,
    },
  ];

  const filteredOpportunities = opportunities.filter((item) =>
    `${item.company} ${item.title}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const scrollToSection = (id) => {
    setPage("home");

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMessage("");

    try {
      const endpoint =
        authMode === "register"
          ? `${API_URL}/auth/register`
          : `${API_URL}/auth/login`;

      const body =
        authMode === "register"
          ? {
              name: authData.name,
              email: authData.email,
              password: authData.password,
            }
          : {
              email: authData.email,
              password: authData.password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(data.message || "Login failed.");
        return;
      }

      if (authMode === "register") {
        setAuthMessage(
          "Registration successful! You can now login."
        );

        setAuthMode("login");

        setAuthData({
          name: "",
          email: authData.email,
          password: "",
        });

        return;
      }

      localStorage.setItem("jobshieldToken", data.token);
      localStorage.setItem(
        "jobshieldUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);
      setLoggedIn(true);
      setPage("dashboard");

      setAuthData({
        name: "",
        email: "",
        password: "",
      });

      setAuthMessage("");
    } catch (error) {
      console.error("Login error:", error);

      setAuthMessage(
        "Cannot connect to JobShield server. Please make sure the backend is running."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("jobshieldToken");
    localStorage.removeItem("jobshieldUser");

    setUser(null);
    setLoggedIn(false);
    setPage("home");
  };

  const handleVerify = (e) => {
    e.preventDefault();

    let score = 0;
    const risks = [];

    if (!verifyData.company.trim()) {
      score += 20;
      risks.push("Company name is missing.");
    }

    if (!verifyData.title.trim()) {
      score += 10;
      risks.push("Opportunity title is missing.");
    }

    if (!verifyData.url.trim()) {
      score += 20;
      risks.push("Website URL is missing.");
    } else if (!verifyData.url.startsWith("https://")) {
      score += 20;
      risks.push("Website is not using HTTPS.");
    }

    if (!verifyData.recruiterEmail.trim()) {
      score += 20;
      risks.push("Recruiter email is missing.");
    } else if (!verifyData.recruiterEmail.includes("@")) {
      score += 20;
      risks.push("Recruiter email format looks incorrect.");
    }

    let riskLevel = "Low Risk";

    if (score >= 50) {
      riskLevel = "High Risk";
    } else if (score >= 20) {
      riskLevel = "Medium Risk";
    }

    if (risks.length === 0) {
      risks.push(
        "No basic warning indicators were detected from the information provided."
      );
    }

    setResult({
      company: verifyData.company || "Not provided",
      title: verifyData.title || "Not provided",
      score,
      riskLevel,
      risks,
    });

    setPage("result");
  };

  const handleReport = (e) => {
    e.preventDefault();

    setReportMessage(
      "Report Submitted ✓ Thank you for helping protect job seekers."
    );

    setReportData({
      company: "",
      title: "",
      url: "",
      reason: "",
    });
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => setPage("home")}
        >
          🛡️ JobShield
        </div>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("how")}
          >
            How It Works
          </button>

          <button onClick={() => setPage("search")}>
            Search
          </button>

          {loggedIn ? (
            <>
              <button
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>

              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() => {
                setAuthMode("login");
                setAuthMessage("");
                setPage("auth");
              }}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-content">
              <p className="eyebrow">
                CHECK BEFORE YOU TRUST
              </p>

              <h1>
                Verify Opportunities.
                <br />
                Protect Your Career.
              </h1>

              <p className="hero-text">
                JobShield helps students and job seekers
                review internship and job opportunities
                for basic warning indicators before they
                apply or trust them.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-btn"
                  onClick={() => setPage("verify")}
                >
                  Verify Opportunity
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => setPage("report")}
                >
                  Report Opportunity
                </button>
              </div>
            </div>

            <div className="shield-card">
              <div className="shield-icon">🛡️</div>

              <h3>Opportunity Check</h3>

              <div className="check-item">
                ✓ Opportunity details
              </div>

              <div className="check-item">
                ✓ Company information
              </div>

              <div className="check-item">
                ✓ Recruiter details
              </div>

              <div className="check-item">
                ✓ Website security
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="section">
            <p className="eyebrow">ABOUT JOBSHIELD</p>

            <h2>What is JobShield?</h2>

            <p className="section-text">
              JobShield is a verification platform
              designed to help students and job seekers
              identify basic warning indicators in job and
              internship opportunities.
            </p>

            <div className="cards">
              <div className="info-card">
                <div className="card-icon">🔍</div>
                <h3>Opportunity Verification</h3>
                <p>
                  Review important opportunity details
                  before applying.
                </p>
              </div>

              <div className="info-card">
                <div className="card-icon">🚨</div>
                <h3>Report Suspicious Opportunities</h3>
                <p>
                  Help other students by reporting
                  questionable opportunities.
                </p>
              </div>

              <div className="info-card">
                <div className="card-icon">🎓</div>
                <h3>Built for Students</h3>
                <p>
                  Simple tools designed for students and
                  freshers.
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" className="section how-section">
            <p className="eyebrow">HOW IT WORKS</p>

            <h2>Simple. Fast. Clear.</h2>

            <div className="steps">
              <div className="step">
                <span>01</span>
                <h3>Enter Details</h3>
                <p>
                  Enter company, opportunity and recruiter
                  information.
                </p>
              </div>

              <div className="step">
                <span>02</span>
                <h3>Run Verification</h3>
                <p>
                  JobShield checks the information for
                  basic warning indicators.
                </p>
              </div>

              <div className="step">
                <span>03</span>
                <h3>Review Result</h3>
                <p>
                  View the risk level and detected
                  indicators.
                </p>
              </div>

              <div className="step">
                <span>04</span>
                <h3>Make an Informed Decision</h3>
                <p>
                  Use the result as one input before taking
                  further action.
                </p>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="section">
            <p className="eyebrow">FEATURES</p>

            <h2>Everything in One Place</h2>

            <div className="feature-grid">
              <div
                className="feature-box"
                onClick={() => setPage("verify")}
              >
                🔍
                <h3>Verify</h3>
                <p>Check an opportunity.</p>
              </div>

              <div
                className="feature-box"
                onClick={() => setPage("report")}
              >
                🚨
                <h3>Report</h3>
                <p>Report suspicious listings.</p>
              </div>

              <div
                className="feature-box"
                onClick={() => setPage("dashboard")}
              >
                📋
                <h3>History</h3>
                <p>View your activity.</p>
              </div>

              <div
                className="feature-box"
                onClick={() => setPage("dashboard")}
              >
                👤
                <h3>Dashboard</h3>
                <p>Manage your account.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* AUTH */}
      {page === "auth" && (
        <section className="auth-page">
          <div className="auth-card">
            <div className="auth-icon">🛡️</div>

            <h2>
              {authMode === "login"
                ? "Welcome Back"
                : "Create Your Account"}
            </h2>

            <p className="auth-subtitle">
              {authMode === "login"
                ? "Login to your JobShield account"
                : "Join JobShield and protect your career"}
            </p>

            <form onSubmit={handleAuth}>
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authData.name}
                  onChange={(e) =>
                    setAuthData({
                      ...authData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={authData.email}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    password: e.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="primary-btn full-btn"
              >
                {authMode === "login"
                  ? "Login"
                  : "Register"}
              </button>
            </form>

            {authMessage && (
              <div className="auth-message">
                {authMessage}
              </div>
            )}

            <p className="switch-auth">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() => {
                  setAuthMode(
                    authMode === "login"
                      ? "register"
                      : "login"
                  );
                  setAuthMessage("");
                }}
              >
                {authMode === "login"
                  ? " Register"
                  : " Login"}
              </button>
            </p>
          </div>
        </section>
      )}

      {/* VERIFY */}
      {page === "verify" && (
        <section className="page-section">
          <div className="form-card">
            <p className="eyebrow">VERIFICATION</p>

            <h2>Verify an Opportunity</h2>

            <p>
              Enter the opportunity details below.
            </p>

            <form onSubmit={handleVerify}>
              <label>Company Name</label>

              <input
                type="text"
                placeholder="Example: TCS"
                value={verifyData.company}
                onChange={(e) =>
                  setVerifyData({
                    ...verifyData,
                    company: e.target.value,
                  })
                }
              />

              <label>Opportunity Title</label>

              <input
                type="text"
                placeholder="Example: Data Analyst Internship"
                value={verifyData.title}
                onChange={(e) =>
                  setVerifyData({
                    ...verifyData,
                    title: e.target.value,
                  })
                }
              />

              <label>Website URL</label>

              <input
                type="text"
                placeholder="https://example.com"
                value={verifyData.url}
                onChange={(e) =>
                  setVerifyData({
                    ...verifyData,
                    url: e.target.value,
                  })
                }
              />

              <label>Recruiter Email</label>

              <input
                type="email"
                placeholder="recruiter@example.com"
                value={verifyData.recruiterEmail}
                onChange={(e) =>
                  setVerifyData({
                    ...verifyData,
                    recruiterEmail: e.target.value,
                  })
                }
              />

              <button
                type="submit"
                className="primary-btn full-btn"
              >
                Run Verification
              </button>
            </form>
          </div>
        </section>
      )}

      {/* RESULT */}
      {page === "result" && result && (
        <section className="page-section">
          <div className="result-card">
            <p className="eyebrow">VERIFICATION RESULT</p>

            <h2>{result.title}</h2>

            <p>
              <strong>Company:</strong>{" "}
              {result.company}
            </p>

            <div className="risk-box">
              <h3>{result.riskLevel}</h3>
              <div className="score">
                {result.score}
              </div>
              <p>Risk Score</p>
            </div>

            <h3>Warning Indicators</h3>

            <ul className="risk-list">
              {result.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>

            <div className="disclaimer">
              This is an initial automated check. It does
              not guarantee that an opportunity is genuine
              or fraudulent.
            </div>

            <button
              className="secondary-btn"
              onClick={() => setPage("verify")}
            >
              Verify Another Opportunity
            </button>
          </div>
        </section>
      )}

      {/* REPORT */}
      {page === "report" && (
        <section className="page-section">
          <div className="form-card">
            <p className="eyebrow">REPORT</p>

            <h2>Report an Opportunity</h2>

            <p>
              Help other students by reporting suspicious
              opportunities.
            </p>

            <form onSubmit={handleReport}>
              <label>Company Name</label>

              <input
                type="text"
                placeholder="Company name"
                value={reportData.company}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    company: e.target.value,
                  })
                }
                required
              />

              <label>Opportunity Title</label>

              <input
                type="text"
                placeholder="Opportunity title"
                value={reportData.title}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    title: e.target.value,
                  })
                }
                required
              />

              <label>Website URL</label>

              <input
                type="text"
                placeholder="Website URL"
                value={reportData.url}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    url: e.target.value,
                  })
                }
              />

              <label>Reason</label>

              <textarea
                placeholder="Why do you think this opportunity is suspicious?"
                value={reportData.reason}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    reason: e.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="primary-btn full-btn"
              >
                Submit Report
              </button>
            </form>

            {reportMessage && (
              <div className="success-message">
                {reportMessage}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SEARCH */}
      {page === "search" && (
        <section className="page-section">
          <div className="search-container">
            <p className="eyebrow">SEARCH</p>

            <h2>Search Opportunities</h2>

            <input
              className="search-input"
              type="text"
              placeholder="Search company or opportunity..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <div className="search-results">
              {filteredOpportunities.map(
                (item, index) => (
                  <div
                    className="opportunity-card"
                    key={index}
                  >
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.company}</p>
                    </div>

                    <div>
                      <span className="risk-badge">
                        {item.risk}
                      </span>

                      <p>
                        Risk Score: {item.score}
                      </p>
                    </div>
                  </div>
                )
              )}

              {filteredOpportunities.length === 0 && (
                <p>No opportunities found.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <section className="dashboard-page">
          <div className="dashboard-header">
            <div>
              <p className="eyebrow">MY DASHBOARD</p>

              <h2>
                Welcome,{" "}
                {user?.name || "Pallavi"} 👋
              </h2>

              <p>
                Manage your JobShield activities.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setPage("verify")}
            >
              Verify Opportunity
            </button>
          </div>

          <div className="dashboard-grid">
            <div
              className="dashboard-card"
              onClick={() => setPage("verify")}
            >
              🔍
              <h3>Verify Opportunity</h3>
              <p>
                Check a job or internship opportunity.
              </p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => setPage("report")}
            >
              🚨
              <h3>Report Opportunity</h3>
              <p>
                Report a suspicious opportunity.
              </p>
            </div>

            <div
              className="dashboard-card"
              onClick={() =>
                alert(
                  "Verification history will be added with the database feature."
                )
              }
            >
              📋
              <h3>Verification History</h3>
              <p>
                View your previous verification checks.
              </p>
            </div>

            <div
              className="dashboard-card"
              onClick={() =>
                alert(
                  "Profile management will be added in the next version."
                )
              }
            >
              👤
              <h3>Profile</h3>
              <p>
                Manage your account information.
              </p>
            </div>
          </div>

          <div className="profile-card">
            <h3>Account Information</h3>

            <p>
              <strong>Name:</strong>{" "}
              {user?.name || "Not available"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {user?.email || "Not available"}
            </p>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div>
          <strong>🛡️ JobShield</strong>
          <p>Check Before You Trust.</p>
        </div>

        <p>
          © 2026 JobShield. Built for students and job
          seekers.
        </p>
      </footer>
    </div>
  );
}

export default App;