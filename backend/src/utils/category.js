// Convert Prisma enum (snake_case) to API format (kebab-case)
export function formatCategory(category) {
  if (category === 'feed_additives') {
    return 'feed-additives';
  }
  return category;
}

// Convert API format (kebab-case) to Prisma enum (snake_case)
export function parseCategory(category) {
  if (category === 'feed-additives') {
    return 'feed_additives';
  }
  return category;
}

