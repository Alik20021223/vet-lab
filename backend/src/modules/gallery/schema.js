export const createSchema = {
  body: {
    type: 'object',
    required: ['image'],
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      description: { type: 'string' },
      descriptionEn: { type: 'string' },
      image: { type: 'string' },
      category: { type: 'string' },
      order: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      description: { type: 'string' },
      descriptionEn: { type: 'string' },
      image: { type: 'string' },
      category: { type: 'string' },
      order: { type: 'number' },
    },
  },
};

