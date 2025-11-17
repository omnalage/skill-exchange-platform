// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import profileIcon from "../assets/usericon.png";

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState({
    username: "Loading...",
    email: "",
    skills: [],
    bio: "",
    sessionsHosted: 0,
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({ type: "error", text: "Not authenticated. Please log in." });
          setLoading(false);
          return;
        }
        const id = localStorage.getItem("id");
        const response = await axios.get(`https://skill-exchange-platform-x98i.onrender.com/api/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data || {};
        setUser({
          username: data.username || "Unknown",
          email: data.email || "",
          skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(",").map(s => s.trim()) : []),
          bio: data.bio || "",
          sessionsHosted: data.sessionsHosted || 0,
          avatar: data.avatar || null,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage({ type: "error", text: "Failed to load profile. Try again later." });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    onLogout && onLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen profile-page flex items-center justify-center p-6">
      {/* Inline theme CSS so the palette shows without touching Tailwind config */}
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --card-bg: rgba(255,250,240,0.03);
          --card-border: rgba(255,250,240,0.06);
        }

        .profile-page {
          background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%);
          color: var(--cream-50);
        }

        .profile-card {
          width: 100%;
          max-width: 920px;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 20px;
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 12px 40px rgba(2,6,23,0.6);
        }

        .left {
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:14px;
        }

        .avatar {
          width: 160px;
          height: 160px;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(45,212,191,0.06);
          border: 1px solid rgba(255,250,240,0.04);
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .avatar img { width:100%; height:100%; object-fit:cover; }

        .username { font-size:20px; font-weight:800; color:var(--mint-500); }
        .email { font-size:13px; color: rgba(255,250,240,0.78); }

        .stats {
          width:100%;
          display:flex;
          gap:10px;
          justify-content:space-between;
        }
        .stat {
          background: rgba(255,250,240,0.02);
          border:1px solid rgba(255,250,240,0.03);
          padding:10px;
          border-radius:10px;
          text-align:center;
        }
        .stat .val { font-weight:700; color: var(--mint-500); font-size:18px; }
        .stat .label { font-size:12px; color: rgba(255,250,240,0.75); }

        .right { padding-top:4px; }
        .section-title { font-weight:800; color:var(--cream-50); font-size:18px; }
        .bio { color: rgba(255,250,240,0.85); margin-top:8px; }

        .skills {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:10px;
        }
        .chip {
          padding:6px 10px;
          background: linear-gradient(90deg,var(--mint-600),var(--mint-500));
          color:#041f2d;
          border-radius:999px;
          font-weight:700;
          font-size:13px;
        }

        .actions {
          display:flex;
          gap:10px;
          margin-top:18px;
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color:#041f2d;
          padding:10px 14px;
          border-radius:12px;
          border:none;
          font-weight:700;
          cursor:pointer;
        }
        .btn-ghost {
          background: transparent;
          color: var(--cream-50);
          border:1px solid rgba(255,250,240,0.06);
          padding:10px 14px;
          border-radius:12px;
          cursor:pointer;
        }

        .close-top {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(255,250,240,0.04);
          border:1px solid rgba(255,250,240,0.06);
          padding:6px 10px;
          border-radius:8px;
          color:var(--cream-50);
          cursor:pointer;
        }

        .logout-btn {
          background: var(--mint-600);
          color:#041f2d;
          padding:8px 12px;
          border-radius:999px;
          border:none;
          font-weight:700;
          cursor:pointer;
        }

        .message-success { color: #9be7cf; margin-bottom:10px; }
        .message-error { color: #ffb4b4; margin-bottom:10px; }

        @media (max-width: 880px) {
          .profile-card { grid-template-columns: 1fr; padding:18px; }
          .left { flex-direction:row; justify-content:space-between; width:100%; }
          .avatar { width:110px; height:110px; }
        }
      `}</style>

      <button className="close-top" onClick={() => navigate("/")}>✕</button>

      <div className="profile-card">
        <div className="left">
          <div className="avatar" aria-hidden>
            <img src={user.avatar || profileIcon} alt={user.username || "User"} />
          </div>

          <div style={{ textAlign: "center", marginTop: 6 }}>
            <div className="username">{user.username}</div>
            <div className="email">{user.email}</div>
          </div>

          <div className="stats" style={{ marginTop: 12 }}>
            <div className="stat">
              <div className="val">{user.skills.length}</div>
              <div className="label">Skills</div>
            </div>
            <div className="stat">
              <div className="val">{user.sessionsHosted || 0}</div>
              <div className="label">Sessions</div>
            </div>
          </div>

          <div style={{ marginTop: 12, width: "100%", textAlign: "center" }}>
            <button
              onClick={handleLogout}
              className="logout-btn"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="right">
          <div>
            <div className="section-title">About</div>
            <div className="bio">{user.bio || "No bio provided. Add a short description about yourself in Edit Profile."}</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div className="section-title">Skills</div>
            <div className="skills">
              {user.skills.length === 0 ? (
                <div style={{ color: "rgba(255,250,240,0.7)" }}>No skills listed yet.</div>
              ) : (
                user.skills.map((s, i) => (
                  <div key={i} className="chip">{s}</div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div className="section-title">Actions</div>
            <div className="actions">
              <button className="btn-primary" onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </button>
              <button className="btn-ghost" onClick={() => navigate("/search-skills")}>
                Discover
              </button>
              <Link to="/connected-users" className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Messages
              </Link>
            </div>
          </div>

          {message && (
            <div style={{ marginTop: 18 }}>
              <div className={message.type === "success" ? "message-success" : "message-error"}>
                {message.text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
