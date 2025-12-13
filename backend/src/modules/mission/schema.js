export const createSchema = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      content: { type: 'string' },
      contentEn: { type: 'string' },
      image: { type: 'string' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      titleEn: { type: 'string' },
      content: { type: 'string' },
      contentEn: { type: 'string' },
      image: { type: 'string' },
    },
  },
};

