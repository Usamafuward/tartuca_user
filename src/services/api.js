const rawBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
export const API_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const toFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const fetchMenuItems = async () => {
  try {
    const response = await fetch(`${API_URL}/menu-items`);
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchSpecialOffers = async () => {
  try {
    const response = await fetch(`${API_URL}/special-offers/`);
    if (!response.ok) throw new Error('Failed to fetch special offers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching special offers:', error);
    throw error;
  }
};

export const fetchGallery = async () => {
  try {
    const response = await fetch(`${API_URL}/gallery/`);
    if (!response.ok) throw new Error('Failed to fetch gallery');
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};

export const fetchReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/reviews/`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchUserOrders = async (token) => {
    try {
        const response = await fetch(`${API_URL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const createReview = async (token, reviewData) => {
    try {
        const response = await fetch(`${API_URL}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error('Failed to submit review');
        return await response.json();
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
  // credentials: { username: "email", password: "password" }
  // API expects form-data for OAuth2PasswordRequestForm
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const fetchUserProfile = async (token) => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (token, userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const uploadUserProfilePicture = async (token, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_URL}/auth/me/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to upload profile picture');
        }
        return await response.json();
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};

export const createReservation = async (reservationData) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/reservations/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) throw new Error('Failed to create reservation');
    return await response.json();
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const fetchUserReservations = async (token) => {
  try {
    const response = await fetch(`${API_URL}/reservations/my-reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const fetchRestaurantSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/settings/`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/orders/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

