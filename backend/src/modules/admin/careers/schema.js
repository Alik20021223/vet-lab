export const createSchema = {
  body: {
    type: 'object',
    required: ['title', 'description', 'fullDescription', 'location', 'type', 'status'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 500 },
      titleEn: { type: 'string', minLength: 3, maxLength: 500 },
      description: { type: 'string', minLength: 10, maxLength: 1000 },
      descriptionEn: { type: 'string', minLength: 10, maxLength: 1000 },
      fullDescription: { type: 'string', minLength: 20 },
      fullDescriptionEn: { type: 'string', minLength: 20 },
      location: { type: 'string', minLength: 2, maxLength: 255 },
      locationEn: { type: 'string', minLength: 2, maxLength: 255 },
      type: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] },
      department: { type: 'string', maxLength: 255 },
      departmentEn: { type: 'string', maxLength: 255 },
      requirements: { type: 'array', items: { type: 'string' } },
      requirementsEn: { type: 'array', items: { type: 'string' } },
      responsibilities: { type: 'array', items: { type: 'string' } },
      responsibilitiesEn: { type: 'array', items: { type: 'string' } },
      benefits: { type: 'array', items: { type: 'string' } },
      benefitsEn: { type: 'array', items: { type: 'string' } },
      salary: {
        type: 'object',
        properties: {
          min: { type: 'number' },
          max: { type: 'number' },
          currency: { type: 'string' },
        },
      },
      status: { type: 'string', enum: ['active', 'draft', 'closed', 'expired'] },
      sortOrder: { type: 'number' },
      expiresAt: { type: 'string' }, // ISO 8601 date string
    },
  },
};

export const updateSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 500 },
      titleEn: { type: 'string', minLength: 3, maxLength: 500 },
      description: { type: 'string', minLength: 10, maxLength: 1000 },
      descriptionEn: { type: 'string', minLength: 10, maxLength: 1000 },
      fullDescription: { type: 'string', minLength: 20 },
      fullDescriptionEn: { type: 'string', minLength: 20 },
      location: { type: 'string', minLength: 2, maxLength: 255 },
      locationEn: { type: 'string', minLength: 2, maxLength: 255 },
      type: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] },
      department: { type: 'string', maxLength: 255 },
      departmentEn: { type: 'string', maxLength: 255 },
      requirements: { type: 'array', items: { type: 'string' } },
      requirementsEn: { type: 'array', items: { type: 'string' } },
      responsibilities: { type: 'array', items: { type: 'string' } },
      responsibilitiesEn: { type: 'array', items: { type: 'string' } },
      benefits: { type: 'array', items: { type: 'string' } },
      benefitsEn: { type: 'array', items: { type: 'string' } },
      salary: {
        type: 'object',
        properties: {
          min: { type: 'number' },
          max: { type: 'number' },
          currency: { type: 'string' },
        },
      },
      status: { type: 'string', enum: ['active', 'draft', 'closed', 'expired'] },
      sortOrder: { type: 'number' },
      expiresAt: { type: 'string' }, // ISO 8601 date string
    },
  },
};

