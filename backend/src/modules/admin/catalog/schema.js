export const createSchema = {
  body: {
    type: 'object',
    required: ['title', 'description', 'category', 'status'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 200 },
      titleEn: { type: 'string', minLength: 3, maxLength: 200 },
      description: { type: 'string', minLength: 10, maxLength: 500 },
      descriptionEn: { type: 'string', minLength: 10, maxLength: 500 },
      fullDescription: { type: 'string' },
      fullDescriptionEn: { type: 'string' },
      applicationMethod: { type: 'string' },
      applicationMethodEn: { type: 'string' },
      category: { 
        type: 'string',
        enum: ['vaccines', 'medicines', 'disinfection', 'feed-additives', 'equipment']
      },
      brandId: { type: 'string' },
      image: { type: 'string' },
      documents: { type: 'array', items: { type: 'string' } },
      status: { 
        type: 'string',
        enum: ['active', 'draft', 'archived']
      },
      sortOrder: { type: 'number' },
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 200 },
      titleEn: { type: 'string', minLength: 3, maxLength: 200 },
      description: { type: 'string', minLength: 10, maxLength: 500 },
      descriptionEn: { type: 'string', minLength: 10, maxLength: 500 },
      fullDescription: { type: 'string' },
      fullDescriptionEn: { type: 'string' },
      applicationMethod: { type: 'string' },
      applicationMethodEn: { type: 'string' },
      category: { 
        type: 'string',
        enum: ['vaccines', 'medicines', 'disinfection', 'feed-additives', 'equipment']
      },
      brandId: { type: 'string' },
      image: { type: 'string' },
      documents: { type: 'array', items: { type: 'string' } },
      status: { 
        type: 'string',
        enum: ['active', 'draft', 'archived']
      },
      sortOrder: { type: 'number' },
    },
  },
};

