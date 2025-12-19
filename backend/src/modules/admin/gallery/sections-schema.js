export const createSectionSchema = {
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      sortOrder: { type: 'number' },
    },
  },
};

export const updateSectionSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      sortOrder: { type: 'number' },
    },
  },
};
