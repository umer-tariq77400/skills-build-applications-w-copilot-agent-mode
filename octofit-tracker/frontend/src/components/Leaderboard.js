import React, { useEffect, useState, useCallback } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  const fetchLeaderboard = useCallback(() => {
    console.log('Fetching from:', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaderboard(results);
        console.log('Fetched leaderboard:', results);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleViewProfile = (entry) => {
    alert(`Viewing profile for ${entry.team || 'Team'}`);
  };

  const handleChallenge = (entry) => {
    setSelectedEntry(entry);
    setShowChallengeModal(true);
  };

  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    alert(`Challenge sent to ${selectedEntry.team}!`);
    setShowChallengeModal(false);
  };

  return (
    <div>
      <h2 className="mb-4">Leaderboard</h2>
      <div className="alert alert-info mb-3">
        <i className="fas fa-trophy me-2"></i>
        Compete with other teams and climb the rankings!
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Points</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={entry.id || idx}>
                <td>
                  {idx + 1}
                  {idx === 0 && <i className="fas fa-crown text-warning ms-2"></i>}
                  {idx === 1 && <i className="fas fa-medal text-secondary ms-2"></i>}
                  {idx === 2 && <i className="fas fa-award text-warning ms-2"></i>}
                </td>
                <td>{entry.team || 'N/A'}</td>
                <td><strong>{entry.points || 'N/A'}</strong></td>
                <td>
                  {idx === 0 && <span className="badge bg-warning">Champion</span>}
                  {idx === 1 && <span className="badge bg-secondary">Runner-up</span>}
                  {idx === 2 && <span className="badge bg-info">Third Place</span>}
                  {idx > 2 && <span className="badge bg-light text-dark">Participant</span>}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewProfile(entry)}>
                    <i className="fas fa-user me-1"></i>View Team
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => handleChallenge(entry)}>
                    <i className="fas fa-bolt me-1"></i>Challenge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Challenge Modal */}
      {showChallengeModal && selectedEntry && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Challenge Team: {selectedEntry.team}</h5>
                <button type="button" className="btn-close" onClick={() => setShowChallengeModal(false)}></button>
              </div>
              <form onSubmit={handleChallengeSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Challenge Type</label>
                    <select className="form-select" required>
                      <option value="">Select challenge type...</option>
                      <option value="fitness">Fitness Challenge</option>
                      <option value="endurance">Endurance Challenge</option>
                      <option value="strength">Strength Challenge</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Challenge Duration (days)</label>
                    <input type="number" className="form-control" min="1" max="30" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="3" placeholder="Optional message to the team..."></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowChallengeModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Send Challenge</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
