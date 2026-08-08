import api from './api';

export const donationService = {
  createDonation: async (donationData) => {
    const payload = {
      food_type: donationData.category + (donationData.description ? ` - ${donationData.description}` : ''),
      quantity: parseInt(donationData.weight) || 10,
      expiry_time: new Date(donationData.expiry).toISOString(),
      pickup_location: donationData.pickup_location || 'Vidya Nagar, Hubballi, Karnataka, India'
    };
    // recommendations/generate creates donation and generates matching recommendations
    return api.post('/recommendations/generate', payload);
  },

  getDonationHistory: async () => {
    return api.get('/donations/history');
  },

  getIncomingDonations: async () => {
    return api.get('/ngo/recommendations');
  },

  getAvailableTasks: async () => {
    return api.get('/volunteer/deliveries/available');
  },

  getMyTasks: async () => {
    return api.get('/volunteer/deliveries/my');
  },

  acceptTask: async (deliveryId) => {
    return api.post(`/volunteer/deliveries/${deliveryId}/accept`);
  },

  confirmPickup: async (deliveryId) => {
    return api.post(`/volunteer/deliveries/${deliveryId}/pickup`);
  },

  confirmDelivery: async (deliveryId) => {
    return api.post(`/volunteer/deliveries/${deliveryId}/deliver`);
  },

  trackDonation: async (donationId) => {
    return api.get(`/donations/${donationId}/track`);
  }
};

export default donationService;
