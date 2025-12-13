export const createSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      nameEn: { type: 'string' },
      position: { type: 'string' },
      positionEn: { type: 'string' },
      bio: { type: 'string' },
      bioEn: { type: 'string' },
      photo: { type: 'string' },
      order: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      nameEn: { type: 'string' },
      position: { type: 'string' },
      positionEn: { type: 'string' },
      bio: { type: 'string' },
      bioEn: { type: 'string' },
      photo: { type: 'string' },
      order: { type: 'number' },
    },
  },
};

