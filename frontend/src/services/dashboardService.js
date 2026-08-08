import api from './api';

export const dashboardService = {
  getRestaurantStats: async () => {
    return api.get('/dashboard/stats');
  },

  getNGOStats: async () => {
    const response = await api.get('/dashboard/stats');
    return {
      ...response,
      data: {
        ...response.data,
        incomingDonations: response.data.activeDonations,
        itemsInInventory: response.data.mealsDonated,
        activeVolunteers: '12',
        familiesFed: '450',
        inventoryDistribution: [
          { name: 'Produce', value: 30, color: '#064E3B' },
          { name: 'Dairy', value: 25, color: '#0D9488' },
          { name: 'Prepared', value: 30, color: '#34D399' },
          { name: 'Bakery', value: 15, color: '#FCD34D' }
        ],
        recentPickups: [
          { name: 'Sarah J.', status: 'En route to Green Leaf', time: '2 mins away' },
          { name: 'Mike T.', status: 'Completed at Sunrise', time: '15 mins ago' }
        ]
      }
    };
  },

  getAdminStats: async () => {
    const response = await api.get('/dashboard/stats');
    return {
      ...response,
      data: {
        ...response.data,
        totalRescues: response.data.mealsDonated,
        activeRegions: '156',
        systemEfficiency: '94.2%',
        trend: [
          { name: 'Week 1', accuracy: 88 },
          { name: 'Week 2', accuracy: 92 },
          { name: 'Week 3', accuracy: 90 },
          { name: 'Week 4', accuracy: 94 }
        ],
        alerts: [
          { id: 'ID-492', type: 'Stalled Donation', desc: 'Bakery Goods (45kg) waiting > 2hrs in Dharwad. No volunteer matched.', action: 'Force Match Action' },
          { id: 'V-102', type: 'Temperature Warning', desc: 'Vehicle V-102 reporting elevated temp (5°C) during transport.', action: 'Contact Driver' }
        ],
        topCities: [
          { city: 'Hubballi', volume: '1.2k', progress: 85 },
          { city: 'Dharwad', volume: '0.8k', progress: 65 },
          { city: 'Bengaluru', volume: '6.2k', progress: 45 }
        ],
        recentUserActivations: [
          { name: 'Greenery Bakery', role: 'Restaurant', region: 'Dharwad, KA', status: 'Active', icon: 'GB' },
          { name: 'Hope Shelter', role: 'NGO', region: 'Bengaluru, KA', status: 'Pending Verification', icon: 'HS' },
          { name: 'John Doe', role: 'Volunteer', region: 'Belagavi, KA', status: 'Active', icon: 'JD' }
        ]
      }
    };
  }
};

export default dashboardService;
