import axios from 'axios';

// Define the API URL (make sure it's the correct endpoint)
const apiUrl = 'http://localhost:5000/api';

// Example: Making a GET request to fetch parking lot data
const getParkingLots = async () => {
  try {
    const response = await axios.get(`${apiUrl}/parking-lots`);
    console.log('Parking Lots:', response.data);
  } catch (error) {
    console.error('Error fetching parking lots:', error);
  }
};

// Example: Making a POST request for user login
const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, {
      email,
      password,
    });
    console.log('User logged in:', response.data);
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

// Call the function to fetch parking lots when needed
getParkingLots();
