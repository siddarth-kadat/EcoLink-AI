// Simulated donation service returning mock responses structured like Axios requests
export const donationService = {
  createDonation: async (donationData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      data: {
        success: true,
        id: 'don_' + Math.random().toString(36).substring(2, 11),
        message: 'Donation created successfully.'
      }
    };
  },

  getDonationHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: [
        { id: 'don-1', foodType: 'Fresh Bakery Items', quantity: '15 lbs', status: 'Delivered', date: '2026-08-05' },
        { id: 'don-2', foodType: 'Assorted Salads', quantity: '10 lbs', status: 'Claimed', date: '2026-08-07' }
      ]
    };
  },

  getIncomingDonations: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: [
        { id: 'don-3', restaurant: 'Green Leaf Bistro', items: '3 boxes assorted vegetables', timeLeft: '2h', matchScore: 94 },
        { id: 'don-4', restaurant: 'Sunrise Bakery', items: '15 loaves day-old bread', timeLeft: '45m', matchScore: 88 },
        { id: 'don-5', restaurant: 'The Grill House', items: '10 servings cooked protein (chilled)', timeLeft: '3h', matchScore: 91 },
        { id: 'don-6', restaurant: 'Ocean Blue Seafood', items: '5 lbs fresh salmon (iced)', timeLeft: '1h', matchScore: 97 }
      ]
    };
  },

  getAvailableTasks: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: [
        { id: 'task-1', title: 'Bakery C', distance: '1.2 mi', weight: '45', time: '15m', type: 'Pickup' },
        { id: 'task-2', title: 'Supermarket D', distance: '2.5 mi', weight: '120', time: '25m', type: 'Pickup' },
        { id: 'task-3', title: 'Farm Stand E', distance: '4.0 mi', weight: '80', time: '40m', type: 'Pickup' }
      ]
    };
  }
};

export default donationService;
