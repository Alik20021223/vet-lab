export const createSchema = {
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      description: { type: 'string' },
      descriptionEn: { type: 'string' },
      requirements: { type: 'string' },
      requirementsEn: { type: 'string' },
      location: { type: 'string' },
      type: { type: 'string' },
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
      requirements: { type: 'string' },
      requirementsEn: { type: 'string' },
      location: { type: 'string' },
      type: { type: 'string' },
    },
  },
};

