export const createSchema = {
  body: {
    type: 'object',
    required: ['image', 'title'],
    properties: {
      image: { type: 'string' },
      title: { type: 'string' },
      titleEn: { type: 'string' },
      sortOrder: { type: 'number' },
      isActive: { type: 'boolean' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      image: { type: 'string' },
      title: { type: 'string' },
      titleEn: { type: 'string' },
      sortOrder: { type: 'number' },
      isActive: { type: 'boolean' },
    },
  },
};
