import React, { useEffect, useState, useCallback } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  const fetchTeams = useCallback(() => {
    console.log('Fetching from:', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
        console.log('Fetched teams:', results);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setShowViewModal(true);
  };

  const handleJoinTeam = (team) => {
    alert(`Request sent to join ${team.name} team!`);
  };

  const handleLeaveTeam = (teamId) => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      alert('You have left the team.');
      // In a real app, you'd make an API call here
    }
  };

  return (
    <div>
      <h2 className="mb-4">Teams</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Team Marvel</h5>
              <p className="card-text">Superheroes saving the world</p>
              <div className="d-flex justify-content-between align-items-center">
                <small>Members: 3</small>
                <span className="badge bg-light text-dark">Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Team DC</h5>
              <p className="card-text">Justice League members</p>
              <div className="d-flex justify-content-between align-items-center">
                <small>Members: 3</small>
                <span className="badge bg-light text-dark">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Team Name</th>
              <th>Members</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => (
              <tr key={team.id || idx}>
                <td>{team.id || idx + 1}</td>
                <td>
                  <strong>{team.name || 'N/A'}</strong>
                  {team.name === 'marvel' && <i className="fas fa-shield-alt text-danger ms-2"></i>}
                  {team.name === 'dc' && <i className="fas fa-bolt text-warning ms-2"></i>}
                </td>
                <td>
                  {team.members && team.members.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {team.members.slice(0, 2).map((member, i) => (
                        <li key={i}><small>{member}</small></li>
                      ))}
                      {team.members.length > 2 && <li><small>...and {team.members.length - 2} more</small></li>}
                    </ul>
                  ) : 'No members'}
                </td>
                <td>
                  <span className="badge bg-success">Active</span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewTeam(team)}>
                    <i className="fas fa-eye me-1"></i>View Team
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => handleJoinTeam(team)}>
                    <i className="fas fa-user-plus me-1"></i>Join Team
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Team Modal */}
      {showViewModal && selectedTeam && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team: {selectedTeam.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <h6>Members:</h6>
                <ul className="list-group mb-3">
                  {selectedTeam.members && selectedTeam.members.map((member, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      {member}
                      <span className="badge bg-primary rounded-pill">Active</span>
                    </li>
                  ))}
                </ul>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border rounded p-2">
                      <h4 className="text-primary">15</h4>
                      <small>Total Activities</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border rounded p-2">
                      <h4 className="text-success">120</h4>
                      <small>Total Points</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border rounded p-2">
                      <h4 className="text-warning">2nd</h4>
                      <small>Current Rank</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                <button type="button" className="btn btn-danger" onClick={() => handleLeaveTeam(selectedTeam.id)}>
                  <i className="fas fa-sign-out-alt me-1"></i>Leave Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
