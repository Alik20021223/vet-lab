export const updateSchema = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 255 },
      content: { type: 'string', minLength: 50 },
      seo: { type: 'object' },
    },
  },
};

