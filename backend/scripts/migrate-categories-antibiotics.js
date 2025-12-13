import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateCategories() {
  try {
    console.log('Starting category migration: premixes -> antibiotics');

    // 1) Add new enum value antibiotics to existing type
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'CatalogCategory' AND e.enumlabel = 'antibiotics') THEN
          ALTER TYPE "CatalogCategory" ADD VALUE 'antibiotics';
        END IF;
      END$$;
    `);

    // 2) Update data: premixes -> antibiotics
    await prisma.$executeRawUnsafe(`
      UPDATE "CatalogItem" SET category = 'antibiotics' WHERE category = 'premixes';
    `);

    // 3) Recreate enum without premixes
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CatalogCategory_old') THEN
          DROP TYPE "CatalogCategory_old";
        END IF;
      END$$;
    `);

    await prisma.$executeRawUnsafe(`ALTER TYPE "CatalogCategory" RENAME TO "CatalogCategory_old";`);

    await prisma.$executeRawUnsafe(`
      CREATE TYPE "CatalogCategory" AS ENUM ('vaccines', 'medicines', 'disinfection', 'feed_additives', 'equipment', 'antibiotics');
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "CatalogItem"
      ALTER COLUMN "category" TYPE "CatalogCategory"
      USING CASE
        WHEN category = 'feed_additives' THEN 'feed_additives'::"CatalogCategory"
        WHEN category = 'antibiotics' THEN 'antibiotics'::"CatalogCategory"
        ELSE category::text::"CatalogCategory"
      END;
    `);

    await prisma.$executeRawUnsafe(`DROP TYPE "CatalogCategory_old" CASCADE;`);

    console.log('✅ Migration completed: premixes removed, antibiotics added.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategories();

