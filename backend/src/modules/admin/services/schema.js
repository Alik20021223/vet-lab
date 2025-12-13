export const createSchema = {
  body: {
    type: 'object',
    required: ['title', 'shortDescription', 'fullDescription', 'status'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 500 },
      titleEn: { type: 'string', minLength: 3, maxLength: 500 },
      shortDescription: { type: 'string', minLength: 10, maxLength: 500 },
      shortDescriptionEn: { type: 'string', minLength: 10, maxLength: 500 },
      fullDescription: { type: 'string', minLength: 50 },
      fullDescriptionEn: { type: 'string', minLength: 50 },
      image: { type: 'string' },
      icon: { type: 'string' },
      status: { type: 'string', enum: ['active', 'draft'] },
      sortOrder: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 500 },
      titleEn: { type: 'string', minLength: 3, maxLength: 500 },
      shortDescription: { type: 'string', minLength: 10, maxLength: 500 },
      shortDescriptionEn: { type: 'string', minLength: 10, maxLength: 500 },
      fullDescription: { type: 'string', minLength: 50 },
      fullDescriptionEn: { type: 'string', minLength: 50 },
      image: { type: 'string' },
      icon: { type: 'string' },
      status: { type: 'string', enum: ['active', 'draft'] },
      sortOrder: { type: 'number' },
    },
  },
};

