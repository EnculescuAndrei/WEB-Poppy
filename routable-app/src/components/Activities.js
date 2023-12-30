import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

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
  const { professorId } = useParams();

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/professors/${professorId}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }, [professorId]);

  useEffect(() => {
    fetchActivities();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchActivities]);

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

  const displayActivities = () => {
    return (
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <strong>{index + 1}. {activity.name}</strong> - {formatDate(activity.date)}, {activity.startTime} - {activity.endTime}
            <p>{activity.description}</p>
            <p>Unique Code: {activity.uniqueCode}</p>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(activity.id)}>Delete</button>
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
    <div>
      <h1>Activity Manager</h1>

      <div>
        <form onSubmit={editingIndex !== null ? handleUpdate : handleCreate}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>Date:</label>
          <DatePicker selected={formData.date} onChange={handleDateChange} dateFormat="yyyy/MM/dd" />
          <label>Description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          <label>Unique Code:</label>
          <input type="text" name="uniqueCode" value={formData.uniqueCode} onChange={handleChange} required />
          <label>Start Time:</label>
          <input type="text" name="startTime" value={formData.startTime} onChange={handleChange} required />
          <label>End Time:</label>
          <input type="text" name="endTime" value={formData.endTime} onChange={handleChange} required />

          <button type="submit">{editingIndex !== null ? 'Update Activity' : 'Create Activity'}</button>
        </form>
      </div>

      <div>
        <h2>Activity List</h2>
        {displayActivities()}
      </div>
    </div>
  );
};

export default ActivityManager;
