export const createSchema = {
  body: {
    type: 'object',
    required: ['title', 'excerpt', 'content', 'publishedAt', 'status'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 500 },
      titleEn: { type: 'string', minLength: 3, maxLength: 500 },
      excerpt: { type: 'string', minLength: 10, maxLength: 500 },
      excerptEn: { type: 'string', minLength: 10, maxLength: 500 },
      content: { type: 'string', minLength: 50 },
      contentEn: { type: 'string', minLength: 50 },
      coverImage: { type: 'string' },
      publishedAt: { type: 'string', format: 'date' },
      status: { type: 'string', enum: ['published', 'draft', 'scheduled'] },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 500 },
      titleEn: { type: 'string', minLength: 3, maxLength: 500 },
      excerpt: { type: 'string', minLength: 10, maxLength: 500 },
      excerptEn: { type: 'string', minLength: 10, maxLength: 500 },
      content: { type: 'string', minLength: 50 },
      contentEn: { type: 'string', minLength: 50 },
      coverImage: { type: 'string' },
      publishedAt: { type: 'string', format: 'date' },
      status: { type: 'string', enum: ['published', 'draft', 'scheduled'] },
    },
  },
};

