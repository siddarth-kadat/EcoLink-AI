// Simulated recommendation service returning mock responses structured like Axios requests
export const recommendationService = {
  getRecommendations: async (donationId = null) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      data: [
        {
          id: 'ngo-1',
          title: 'City Hope Mission',
          distance: '2.4',
          capacity: 'High',
          score: 98,
          factors: [
            { label: 'Food Match Priority', status: 'Optimal', value: 95 },
            { label: 'Logistical Ease', status: 'Optimal', value: 92 },
            { label: 'Delivery Risk', status: 'Minimal', value: 12 }
          ]
        },
        {
          id: 'ngo-2',
          title: 'Community Pantry East',
          distance: '4.1',
          capacity: 'Moderate',
          score: 89,
          factors: [
            { label: 'Food Match Priority', status: 'High', value: 85 },
            { label: 'Logistical Ease', status: 'Standard', value: 78 },
            { label: 'Delivery Risk', status: 'Low', value: 18 }
          ]
        }
      ]
    };
  }
};

export default recommendationService;
