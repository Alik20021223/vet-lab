export const createSchema = {
  body: {
    type: 'object',
    required: ['name', 'position'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      nameEn: { type: 'string', minLength: 2, maxLength: 255 },
      position: { type: 'string', minLength: 2, maxLength: 255 },
      positionEn: { type: 'string', minLength: 2, maxLength: 255 },
      photo: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      social: { type: 'object' },
      sortOrder: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      nameEn: { type: 'string', minLength: 2, maxLength: 255 },
      position: { type: 'string', minLength: 2, maxLength: 255 },
      positionEn: { type: 'string', minLength: 2, maxLength: 255 },
      photo: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      social: { type: 'object' },
      sortOrder: { type: 'number' },
    },
  },
};

