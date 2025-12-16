export const updateSchema = {
  body: {
    type: 'object',
    required: ['phone', 'email', 'address', 'mapLat', 'mapLng'],
    properties: {
      phone: { type: 'string' },
      email: { type: 'string', format: 'email' },
      address: { type: 'string' },
      addressEn: { type: ['string', 'null'] },
      mapLat: { 
        anyOf: [
          { type: 'number' },
          { type: 'string' }
        ]
      },
      mapLng: { 
        anyOf: [
          { type: 'number' },
          { type: 'string' }
        ]
      },
      workingHours: { type: ['string', 'null'] },
      workingHoursEn: { type: ['string', 'null'] },
    },
  },
};

