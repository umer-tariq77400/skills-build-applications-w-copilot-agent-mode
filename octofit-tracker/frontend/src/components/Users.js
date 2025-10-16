import React, { useEffect, useState, useCallback } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  const fetchUsers = useCallback(() => {
    console.log('Fetching from:', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
        console.log('Fetched users:', results);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleMessage = (user) => {
    setSelectedUser(user);
    setMessageForm({ subject: '', message: '' });
    setShowMessageModal(true);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent to ${selectedUser.name}!`);
    setShowMessageModal(false);
  };

  const getTeamColor = (team) => {
    return team === 'dc' ? 'primary' : 'danger';
  };

  const getTeamIcon = (team) => {
    return team === 'dc' ? 'fas fa-bolt' : 'fas fa-shield-alt';
  };

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      <div className="row mb-4">
        {users.slice(0, 3).map((user, idx) => (
          <div key={user.id || idx} className="col-md-4 mb-3">
            <div className={`card border-${getTeamColor(user.team)}`}>
              <div className="card-body text-center">
                <div className={`bg-${getTeamColor(user.team)} text-white rounded-circle d-inline-flex align-items-center justify-content-center`} style={{width: '60px', height: '60px'}}>
                  <i className={`${getTeamIcon(user.team)} fa-2x`}></i>
                </div>
                <h5 className="card-title mt-2">{user.name}</h5>
                <p className="card-text">
                  <span className={`badge bg-${getTeamColor(user.team)}`}>{user.team?.toUpperCase()}</span>
                </p>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id || idx}>
                <td>{user.id || idx + 1}</td>
                <td>
                  <strong>{user.name || 'N/A'}</strong>
                  <br />
                  <small className="text-muted">{user.email}</small>
                </td>
                <td>{user.email || 'N/A'}</td>
                <td>
                  <span className={`badge bg-${getTeamColor(user.team)}`}>
                    <i className={`${getTeamIcon(user.team)} me-1`}></i>
                    {user.team?.toUpperCase() || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="badge bg-success">
                    <i className="fas fa-circle me-1"></i>Active
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewProfile(user)}>
                    <i className="fas fa-user me-1"></i>View Profile
                  </button>
                  <button className="btn btn-info btn-sm" onClick={() => handleMessage(user)}>
                    <i className="fas fa-envelope me-1"></i>Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile: {selectedUser.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <div className={`bg-${getTeamColor(selectedUser.team)} text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} style={{width: '80px', height: '80px'}}>
                  <i className={`${getTeamIcon(selectedUser.team)} fa-3x`}></i>
                </div>
                <h4>{selectedUser.name}</h4>
                <p className="text-muted">{selectedUser.email}</p>
                <span className={`badge bg-${getTeamColor(selectedUser.team)} fs-6`}>{selectedUser.team?.toUpperCase()} Team</span>

                <hr />
                <div className="row text-center">
                  <div className="col-4">
                    <h5 className="text-primary">25</h5>
                    <small>Activities</small>
                  </div>
                  <div className="col-4">
                    <h5 className="text-success">180</h5>
                    <small>Points</small>
                  </div>
                  <div className="col-4">
                    <h5 className="text-warning">5th</h5>
                    <small>Rank</small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Close</button>
                <button type="button" className="btn btn-success" onClick={() => handleMessage(selectedUser)}>
                  <i className="fas fa-envelope me-1"></i>Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message to {selectedUser.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowMessageModal(false)}></button>
              </div>
              <form onSubmit={handleMessageSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={messageForm.subject}
                      onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                      placeholder="Type your message here..."
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane me-1"></i>Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
