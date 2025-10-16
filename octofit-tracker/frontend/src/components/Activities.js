import React, { useEffect, useState, useCallback } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editForm, setEditForm] = useState({ user: '', activity: '', duration: '' });
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  const fetchActivities = useCallback(() => {
    console.log('Fetching from:', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
        console.log('Fetched activities:', results);
      })
      .catch(err => console.error('Error fetching activities:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleView = (activity) => {
    setSelectedActivity(activity);
    setShowViewModal(true);
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setEditForm({
      user: activity.user || '',
      activity: activity.activity || '',
      duration: activity.duration || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd make a PUT request to update the activity
    console.log('Updating activity:', selectedActivity.id, editForm);
    // For now, just update locally
    setActivities(activities.map(act =>
      act.id === selectedActivity.id ? { ...act, ...editForm } : act
    ));
    setShowEditModal(false);
  };

  const handleDelete = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      // In a real app, you'd make a DELETE request
      console.log('Deleting activity:', activityId);
      setActivities(activities.filter(act => act.id !== activityId));
    }
  };

  return (
    <div>
      <h2 className="mb-4">Activities</h2>
      <button className="btn btn-success mb-3" onClick={() => setShowEditModal(true)}>
        <i className="fas fa-plus me-2"></i>Add New Activity
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Activity</th>
              <th>Duration (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, idx) => (
              <tr key={activity.id || idx}>
                <td>{activity.id || idx + 1}</td>
                <td>{activity.user || 'N/A'}</td>
                <td>{activity.activity || 'N/A'}</td>
                <td>{activity.duration || 'N/A'}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleView(activity)}>
                    <i className="fas fa-eye me-1"></i>View
                  </button>
                  <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(activity)}>
                    <i className="fas fa-edit me-1"></i>Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(activity.id)}>
                    <i className="fas fa-trash me-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && selectedActivity && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>User:</strong> {selectedActivity.user}</p>
                <p><strong>Activity:</strong> {selectedActivity.activity}</p>
                <p><strong>Duration:</strong> {selectedActivity.duration} minutes</p>
                <p><strong>ID:</strong> {selectedActivity.id}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedActivity ? 'Edit Activity' : 'Add New Activity'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">User</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.user}
                      onChange={(e) => setEditForm({...editForm, user: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Activity</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.activity}
                      onChange={(e) => setEditForm({...editForm, activity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
