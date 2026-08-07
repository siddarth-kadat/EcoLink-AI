// Simulated dashboard service returning mock responses structured like Axios requests
export const dashboardService = {
  getRestaurantStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        mealsDonated: '1,248',
        activeDonations: '14',
        deliverySuccess: '98%',
        matchSuccess: '94%',
        trend: [
          { name: 'Mon', pounds: 450 },
          { name: 'Tue', pounds: 520 },
          { name: 'Wed', pounds: 480 },
          { name: 'Thu', pounds: 610 },
          { name: 'Fri', pounds: 580 },
          { name: 'Sat', pounds: 720 },
          { name: 'Sun', pounds: 690 }
        ],
        activities: [
          { id: 'act-1', type: 'pickup', title: 'Donation #4029 Picked Up', desc: '50 lbs of fresh produce collected by City Harvest.', time: '10 mins ago' },
          { id: 'act-2', type: 'match', title: 'AI Match Found', desc: 'Donation #4030 matched with Northside Food Bank.', time: '45 mins ago' },
          { id: 'act-3', type: 'log', title: 'New Donation Logged', desc: 'Prepared meals (20 servings) available for pickup.', time: '2 hours ago' },
          { id: 'act-4', type: 'report', title: 'Weekly Report Generated', desc: 'Your impact stats for last week are now ready.', time: 'Yesterday' }
        ]
      }
    };
  },

  getNGOStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        incomingDonations: '8',
        itemsInInventory: '1.2k',
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
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        totalRescues: '42,891',
        activeRegions: '156',
        systemEfficiency: '94.2%',
        trend: [
          { name: 'Week 1', accuracy: 88 },
          { name: 'Week 2', accuracy: 92 },
          { name: 'Week 3', accuracy: 90 },
          { name: 'Week 4', accuracy: 94 }
        ],
        alerts: [
          { id: 'ID-492', type: 'Stalled Donation', desc: 'Bakery Goods (45kg) waiting > 2hrs in Seattle. No volunteer matched.', action: 'Force Match Action' },
          { id: 'V-102', type: 'Temperature Warning', desc: 'Vehicle V-102 reporting elevated temp (5°C) during transport.', action: 'Contact Driver' }
        ],
        topCities: [
          { city: 'New York', volume: '12k', progress: 85 },
          { city: 'San Francisco', volume: '8.5k', progress: 65 },
          { city: 'Chicago', volume: '6.2k', progress: 45 }
        ],
        recentUserActivations: [
          { name: 'Greenery Bakery', role: 'Restaurant', region: 'Seattle, WA', status: 'Active', icon: 'GB' },
          { name: 'Hope Shelter', role: 'NGO', region: 'Portland, OR', status: 'Pending Verification', icon: 'HS' },
          { name: 'John Doe', role: 'Volunteer', region: 'Austin, TX', status: 'Active', icon: 'JD' }
        ]
      }
    };
  }
};

export default dashboardService;
