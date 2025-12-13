export const updateSchema = {
  body: {
    type: 'object',
    required: ['phone', 'email', 'address', 'mapLat', 'mapLng'],
    properties: {
      phone: { type: 'string' },
      email: { type: 'string', format: 'email' },
      address: { type: 'string' },
      mapLat: { type: 'number', minimum: -90, maximum: 90 },
      mapLng: { type: 'number', minimum: -180, maximum: 180 },
      workingHours: { type: 'string' },
      requisites: { type: 'object' },
    },
  },
};

