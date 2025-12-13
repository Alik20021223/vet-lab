export const createSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      logo: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      sortOrder: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      logo: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      sortOrder: { type: 'number' },
    },
  },
};

