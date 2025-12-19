export const createSchema = {
  body: {
    type: 'object',
    required: ['image'],
    properties: {
      image: { type: 'string' },
      sectionId: { type: 'string' },
      category: { type: 'string' },
      description: { type: 'string', maxLength: 1000 },
      sortOrder: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      image: { type: 'string' },
      sectionId: { type: 'string' },
      category: { type: 'string' },
      description: { type: 'string', maxLength: 1000 },
      sortOrder: { type: 'number' },
    },
  },
};

