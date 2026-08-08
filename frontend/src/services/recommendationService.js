import api from './api';

export const recommendationService = {
  getRecommendations: async () => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ngo') {
      // Return static mock calculations for live match sidebar preview (Restaurant role)
      return {
        data: [
          { id: 'ngo-1', title: 'Akshaya Patra Foundation Hubli', distance: '2.4', capacity: 'High', score: 98 },
          { id: 'ngo-2', title: 'Dharwad Food Rescue Shelter', distance: '4.1', capacity: 'Moderate', score: 89 }
        ]
      };
    }
    // NGO role retrieves actual matched recommendations from the database
    return api.get('/ngo/recommendations');
  },

  acceptRecommendation: async (recommendationId) => {
    return api.post(`/ngo/recommendations/${recommendationId}/accept`);
  },
  
  distributeInventory: async (donationId) => {
    return api.post(`/ngo/donations/${donationId}/distribute`);
  },
  
  receiveInventory: async (donationId) => {
    return api.post(`/ngo/donations/${donationId}/receive`);
  }
};

export default recommendationService;
