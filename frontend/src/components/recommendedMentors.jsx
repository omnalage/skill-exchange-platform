import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/usericon.png'; // Ensure this path is correct

const RecommendedMentors = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('id');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Using the standardized API URL (adjust if using .env)
        const res = await axios.get(`https://skill-exchange-platform-x98i.onrender.com/api/recommendations/${currentUserId}`);
        setRecommendations(res.data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) fetchRecommendations();
  }, [currentUserId]);

  if (loading) return <div className="p-6 text-center text-sm opacity-60" style={{color: 'var(--cream-50)'}}>Analysing skills for matches...</div>;
  if (recommendations.length === 0) return null; 

  return (
    <div className="rec-container mt-12 mb-12">
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --card-bg: rgba(255,250,240,0.03);
          --card-border: rgba(255,250,240,0.08);
          --cream-50: #fffaf0;
        }

        .rec-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .ai-badge {
          background: linear-gradient(135deg, #6366f1, #a855f7); /* AI Purple Gradient */
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: 0.5px;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        }

        .rec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .rec-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .rec-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.5);
          border-color: rgba(45, 212, 191, 0.3);
        }

        .rec-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(45,212,191,0.1);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }
        
        .match-score {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .match-label {
          font-size: 10px;
          text-transform: uppercase;
          color: rgba(255,250,240,0.5);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .skill-pill {
          font-size: 12px;
          background: rgba(7, 16, 37, 0.6);
          border: 1px solid rgba(255,250,240,0.1);
          color: rgba(255,250,240,0.8);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .btn-connect-rec {
          width: 100%;
          margin-top: 16px;
          padding: 10px;
          border-radius: 10px;
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-connect-rec:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="rec-header">
        <h3 className="text-2xl font-bold" style={{color: 'var(--cream-50)'}}>Recommended Mentors</h3>
        <span className="ai-badge">AI MATCH</span>
      </div>
      
      <div className="rec-grid">
        {recommendations.map((user) => (
          <div key={user._id} className="rec-card">
            
            {/* Top Section: Avatar + Score */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="rec-avatar">
                  <img src={user.avatar || profileIcon} alt={user.username} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-lg leading-tight" style={{color: 'var(--cream-50)'}}>
                    {user.username}
                  </div>
                  <div className="text-xs opacity-60" style={{color: 'var(--cream-50)'}}>
                    {user.email ? user.email.split('@')[0] : 'User'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="match-score">{user.matchScore}%</div>
                <div className="match-label">Match</div>
              </div>
            </div>

            {/* Middle Section: Skills */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2 opacity-50" style={{color: 'var(--cream-50)'}}>TEACHES</div>
              <div className="flex flex-wrap gap-2">
                {user.skills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="skill-pill">
                    {skill}
                  </span>
                ))}
                {user.skills.length > 4 && (
                  <span className="skill-pill opacity-50">+{user.skills.length - 4}</span>
                )}
              </div>
            </div>

            {/* Bottom: Action */}
            <button 
              onClick={() => navigate('/search-skills')} // Redirects to search where they can connect
              className="btn-connect-rec"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMentors;