import React, { useEffect, useState, useCallback } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  const fetchWorkouts = useCallback(() => {
    console.log('Fetching from:', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
        console.log('Fetched workouts:', results);
      })
      .catch(err => console.error('Error fetching workouts:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleStartWorkout = (workout) => {
    setSelectedWorkout(workout);
    setWorkoutProgress(0);
    setIsWorkoutActive(true);
    setShowStartModal(true);

    // Simulate workout progress
    const interval = setInterval(() => {
      setWorkoutProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWorkoutActive(false);
          setTimeout(() => {
            alert(`Congratulations! You completed the ${workout.name} workout!`);
            setShowStartModal(false);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleViewDetails = (workout) => {
    setSelectedWorkout(workout);
    setShowDetailsModal(true);
  };

  const getWorkoutDifficulty = (workout) => {
    // Simple logic to determine difficulty based on suggested_for
    if (workout.suggested_for && workout.suggested_for.includes('Superman')) {
      return { level: 'Advanced', color: 'danger', icon: 'fas fa-fire' };
    } else if (workout.suggested_for && workout.suggested_for.includes('Wonder Woman')) {
      return { level: 'Intermediate', color: 'warning', icon: 'fas fa-star' };
    }
    return { level: 'Beginner', color: 'success', icon: 'fas fa-leaf' };
  };

  return (
    <div>
      <h2 className="mb-4">Workouts</h2>
      <div className="alert alert-success mb-4">
        <i className="fas fa-dumbbell me-2"></i>
        Choose from our curated workout plans designed for different fitness levels!
      </div>

      <div className="row mb-4">
        {workouts.map((workout, idx) => {
          const difficulty = getWorkoutDifficulty(workout);
          return (
            <div key={workout.id || idx} className="col-md-6 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{workout.name}</h5>
                    <span className={`badge bg-${difficulty.color}`}>
                      <i className={`${difficulty.icon} me-1`}></i>
                      {difficulty.level}
                    </span>
                  </div>
                  <p className="card-text text-muted">
                    Recommended for: {workout.suggested_for ? workout.suggested_for.join(', ') : 'All users'}
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm flex-fill" onClick={() => handleStartWorkout(workout)}>
                      <i className="fas fa-play me-1"></i>Start Workout
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewDetails(workout)}>
                      <i className="fas fa-info-circle me-1"></i>Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Workout Name</th>
              <th>Difficulty</th>
              <th>Recommended For</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout, idx) => {
              const difficulty = getWorkoutDifficulty(workout);
              return (
                <tr key={workout.id || idx}>
                  <td>{workout.id || idx + 1}</td>
                  <td>
                    <strong>{workout.name || 'N/A'}</strong>
                    <br />
                    <small className={`text-${difficulty.color}`}>
                      <i className={`${difficulty.icon} me-1`}></i>
                      {difficulty.level} Level
                    </small>
                  </td>
                  <td>
                    <span className={`badge bg-${difficulty.color} fs-6`}>
                      {difficulty.level}
                    </span>
                  </td>
                  <td>
                    {workout.suggested_for && workout.suggested_for.length > 0 ? (
                      <div>
                        {workout.suggested_for.slice(0, 2).map((person, i) => (
                          <span key={i} className="badge bg-light text-dark me-1">{person}</span>
                        ))}
                        {workout.suggested_for.length > 2 && (
                          <span className="badge bg-secondary">+{workout.suggested_for.length - 2} more</span>
                        )}
                      </div>
                    ) : 'All users'}
                  </td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleStartWorkout(workout)}>
                      <i className="fas fa-play me-1"></i>Start Workout
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetails(workout)}>
                      <i className="fas fa-info-circle me-1"></i>View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Start Workout Modal */}
      {showStartModal && selectedWorkout && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Workout: {selectedWorkout.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowStartModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-4">
                  <i className="fas fa-dumbbell fa-3x text-primary mb-3"></i>
                  <h4>Get ready to crush this workout!</h4>
                </div>

                {isWorkoutActive && (
                  <div className="mb-4">
                    <div className="progress mb-3" style={{ height: '25px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        role="progressbar"
                        style={{ width: `${workoutProgress}%` }}
                        aria-valuenow={workoutProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {workoutProgress}%
                      </div>
                    </div>
                    <p className="text-muted">
                      {workoutProgress < 30 && "Warming up..."}
                      {workoutProgress >= 30 && workoutProgress < 70 && "Keep pushing!"}
                      {workoutProgress >= 70 && workoutProgress < 100 && "Almost there!"}
                      {workoutProgress === 100 && "Workout complete!"}
                    </p>
                  </div>
                )}

                {!isWorkoutActive && (
                  <div className="alert alert-info">
                    <h6>Workout Details:</h6>
                    <p><strong>Recommended for:</strong> {selectedWorkout.suggested_for ? selectedWorkout.suggested_for.join(', ') : 'All users'}</p>
                    <p><strong>Difficulty:</strong> {getWorkoutDifficulty(selectedWorkout).level}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!isWorkoutActive ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowStartModal(false)}>Cancel</button>
                    <button type="button" className="btn btn-success btn-lg" onClick={() => handleStartWorkout(selectedWorkout)}>
                      <i className="fas fa-play me-2"></i>Begin Workout
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-danger" onClick={() => setShowStartModal(false)}>
                    <i className="fas fa-stop me-1"></i>Stop Workout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedWorkout && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Workout Details: {selectedWorkout.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Recommended For:</h6>
                    <div className="mb-3">
                      {selectedWorkout.suggested_for && selectedWorkout.suggested_for.map((person, idx) => (
                        <span key={idx} className="badge bg-primary me-2 mb-1">{person}</span>
                      ))}
                    </div>

                    <h6>Difficulty Level:</h6>
                    <span className={`badge bg-${getWorkoutDifficulty(selectedWorkout).color} fs-6 mb-3 d-block`}>
                      <i className={`${getWorkoutDifficulty(selectedWorkout).icon} me-1`}></i>
                      {getWorkoutDifficulty(selectedWorkout).level}
                    </span>

                    <h6>Estimated Benefits:</h6>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-check text-success me-2"></i>Improved strength</li>
                      <li><i className="fas fa-check text-success me-2"></i>Better endurance</li>
                      <li><i className="fas fa-check text-success me-2"></i>Enhanced fitness</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Sample Exercises:</h6>
                    <div className="list-group mb-3">
                      <div className="list-group-item">
                        <i className="fas fa-dumbbell text-primary me-2"></i>Weight Training
                      </div>
                      <div className="list-group-item">
                        <i className="fas fa-running text-success me-2"></i>Cardio Exercises
                      </div>
                      <div className="list-group-item">
                        <i className="fas fa-yoga text-warning me-2"></i>Flexibility Work
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Tip:</strong> Remember to warm up before starting and cool down afterwards!
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                <button type="button" className="btn btn-success" onClick={() => { setShowDetailsModal(false); handleStartWorkout(selectedWorkout); }}>
                  <i className="fas fa-play me-1"></i>Start This Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
