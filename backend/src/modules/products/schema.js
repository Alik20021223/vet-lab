export const createSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      nameEn: { type: 'string' },
      description: { type: 'string' },
      descriptionEn: { type: 'string' },
      image: { type: 'string' },
      categoryId: { type: 'string' },
      price: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      nameEn: { type: 'string' },
      description: { type: 'string' },
      descriptionEn: { type: 'string' },
      image: { type: 'string' },
      categoryId: { type: 'string' },
      price: { type: 'number' },
    },
  },
};

