import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; // Import Bootstrap Button
import '../styles/Activities.css';

const ActivityManager = () => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date(),
    description: '',
    uniqueCode: '',
    startTime: '',
    endTime: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [feedback, setFeedback] = useState({
    uniqueCode: '',
    data: [],
  });
  const { professorId } = useParams();

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/professors/${professorId}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }, [professorId]);

  const fetchFeedback = useCallback(async (uniqueCode) => {
    try {
      const response = await axiosInstance.get(`/activities/${uniqueCode}/feedback`);
      setFeedback({
        uniqueCode,
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    const feedbackInterval = setInterval(() => {
      if (feedback.uniqueCode) {
        fetchFeedback(feedback.uniqueCode);
      }
    }, 1000);

    return () => clearInterval(feedbackInterval); // Cleanup on component unmount
  }, [fetchActivities, fetchFeedback, feedback.uniqueCode]);

  const createActivity = async () => {
    try {
      await axiosInstance.post(`/professors/${professorId}/activities`, formData);
      fetchActivities();
      resetFormData();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const updateActivity = async () => {
    try {
      const id = activities[editingIndex].id;
      await axiosInstance.put(`/professors/${professorId}/activities/${id}`, formData);
      fetchActivities();
      resetFormData();
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axiosInstance.delete(`/professors/${professorId}/activities/${id}`);
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const closeFeedback = () => {
    setFeedback({
      uniqueCode: '',
      data: [],
    });
  };

  const convertToEmoji = (reactType) => {
    switch (reactType) {
      case 'Smiley':
        return '😀';
      case 'Frowny':
        return '☹️';
      case 'Surprised':
        return '😲';
      case 'Confused':
        return '😕';
      default:
        return reactType;
    }
  };

  const displayActivities = () => {
    return (
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <strong>{index + 1}. {activity.name}</strong> - {formatDate(activity.date)}, {activity.startTime} - {activity.endTime}
            <p>{activity.description}</p>
            <p>Unique Code: {activity.uniqueCode}</p>
            <Button className="edit-button" variant="warning" onClick={() => handleEdit(index)}>Edit</Button>
            <Button className="view-button" variant="info" onClick={() => fetchFeedback(activity.uniqueCode)}>View Feedback</Button>
            <Button className="delete-button" variant="danger" onClick={() => handleDelete(activity.id)}>Delete</Button>
            <div className="feedback-container">
              {activity.uniqueCode === feedback.uniqueCode && (
                <div>
                  <h4>Feedback</h4>
                  <ul>
                    {feedback.data
                      .sort((a, b) => new Date(b.reactTime) - new Date(a.reactTime))
                      .map((feedbackItem, index) => (
                        <li key={index}>
                          <p>{convertToEmoji(feedbackItem.reactType)}-{new Date(feedbackItem.reactTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                        </li>
                      ))}
                  </ul>
                  <Button className="close-button" variant="secondary" onClick={closeFeedback}>Close</Button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createActivity();
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const activityToEdit = activities[index];
    const date = new Date(activityToEdit.date);
    setFormData({ ...activityToEdit, date });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateActivity();
  };

  const handleDelete = (id) => {
    deleteActivity(id);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      date: new Date(),
      description: '',
      uniqueCode: '',
      startTime: '',
      endTime: '',
    });
  };

  return (
    <div className="activity-manager">
      <h1>Activity Manager</h1>

      <div className="form-container">
        <form onSubmit={editingIndex !== null ? handleUpdate : handleCreate}>
          <div className="form-label">
            <label>Name:</label>
          </div>
          <div className="form-input">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-label">
            <label>Date:</label>
          </div>
          <div className="form-input">
            <DatePicker selected={formData.date} onChange={handleDateChange} dateFormat="yyyy/MM/dd" />
          </div>

          <div className="form-label">
            <label>Description:</label>
          </div>
          <div className="form-input">
            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-label">
            <label>Unique Code:</label>
          </div>
          <div className="form-input">
            <input type="text" name="uniqueCode" value={formData.uniqueCode} onChange={handleChange} required />
          </div>

          <div className="form-label">
            <label>Start Time:</label>
          </div>
          <div className="form-input">
            <input type="text" name="startTime" value={formData.startTime} onChange={handleChange} required />
          </div>

          <div className="form-label">
            <label>End Time:</label>
          </div>
          <div className="form-input">
            <input type="text" name="endTime" value={formData.endTime} onChange={handleChange} required />
          </div>

          <div className="form-input">
            <Button type="submit" variant={editingIndex !== null ? 'warning' : 'success'}>   
              {editingIndex !== null ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </div>

      <div className="activity-list-container">
        <div className="activity-list">
          <h2>Activity List</h2>
          {displayActivities()}
        </div>
      </div>
    </div>
  );
};

export default ActivityManager;
