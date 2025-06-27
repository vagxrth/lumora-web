import { config } from 'dotenv';
import { client } from '@/lib/prisma';

// Load environment variables
config();

// Helper function to safely convert timestamp to Date
function safeDateConversion(timestamp?: number): Date {
  if (!timestamp) return new Date();

  // Convert seconds to milliseconds
  const date = new Date(timestamp * 1000);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid timestamp: ${timestamp}, falling back to current date`);
    return new Date();
  }

  // Check for unreasonable dates (before 2000 or after 2100)
  const year = date.getFullYear();
  if (year < 2000 || year > 2100) {
    console.warn(`Suspicious date year: ${year}, falling back to current date`);
    return new Date();
  }

  return date;
}

async function getClerkUsers() {
  const clerkUsers: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    created_at: number;
    updated_at: number;
    external_accounts: {
      id: string;
      provider: string;
      identification_id: string;
      provider_user_id: string;
      approved_scopes: string;
      email_address: string;
      first_name: string;
      last_name: string;
      image_url: string;
      created_at: number;
      updated_at: number;
    }[]
  }[] = [];

  let offset = 0;
  const limit = 500;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(`https://api.clerk.com/v1/users?offset=${offset}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const clerkUsersData = await response.json();
      
      if (clerkUsersData.length === 0) {
        hasMore = false;
      } else {
        clerkUsers.push(...clerkUsersData);
        offset += limit;
      }
    } catch (error) {
      console.error('Error fetching Clerk users:', error);
      hasMore = false;
    }
  }

  return clerkUsers;
}

async function migrateFromClerk() {
  console.log('🔄 Starting migration from Clerk to Better Auth...');
  
  const clerkUsers = await getClerkUsers();
  console.log(`📊 Found ${clerkUsers.length} users to migrate`);

  let migratedCount = 0;
  let errorCount = 0;

  for (const clerkUser of clerkUsers) {
    try {
      const { id, first_name, last_name, image_url, created_at, updated_at, external_accounts } = clerkUser;

      // Find Google OAuth account
      const googleAccount = external_accounts?.find(account => 
        account.provider === 'oauth_google' || account.provider === 'google'
      );

      if (!googleAccount) {
        console.log(`⚠️  Skipping user ${id} - no Google OAuth account found`);
        continue;
      }

      // Check if user already exists by externalId (Clerk ID) or email
      const existingUser = await client.user.findFirst({
        where: {
          OR: [
            { externalId: id },
            { email: googleAccount.email_address }
          ]
        }
      });

      let createdUser;
      if (existingUser) {
        console.log(`📝 User ${googleAccount.email_address} already exists, updating...`);
        createdUser = await client.user.update({
          where: { id: existingUser.id },
          data: {
            email: googleAccount.email_address,
            emailVerified: true,
            name: `${first_name || ''} ${last_name || ''}`.trim() || null,
            firstname: first_name,
            lastname: last_name,
            image: image_url,
            externalId: id, // Update externalId to Clerk ID
            updatedAt: safeDateConversion(updated_at),
          },
        });
      } else {
        // Create new user with auto-generated UUID
        const userData = {
          email: googleAccount.email_address,
          emailVerified: true, // Google OAuth users are considered verified
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          firstname: first_name,
          lastname: last_name,
          image: image_url,
          createdAt: safeDateConversion(created_at),
          updatedAt: safeDateConversion(updated_at),
          externalId: id, // Keep Clerk ID for reference
        };

        createdUser = await client.user.create({
          data: userData,
        });
      }

      // Create or update Google OAuth account
      const accountData = {
        id: googleAccount.id,
        providerId: "google",
        accountId: googleAccount.provider_user_id,
        scope: googleAccount.approved_scopes,
        userId: createdUser.id,
        createdAt: safeDateConversion(googleAccount.created_at),
        updatedAt: safeDateConversion(googleAccount.updated_at),
      };

      await client.account.upsert({
        where: { id: googleAccount.id },
        update: {
          providerId: "google",
          accountId: googleAccount.provider_user_id,
          scope: googleAccount.approved_scopes,
          userId: createdUser.id,
          updatedAt: safeDateConversion(googleAccount.updated_at),
        },
        create: accountData,
      });

      migratedCount++;
      console.log(`✅ Migrated user: ${googleAccount.email_address} (${migratedCount}/${clerkUsers.length})`);

    } catch (error) {
      console.error(`❌ Error migrating user ${clerkUser.id}:`, error);
      errorCount++;
    }
  }

  console.log('\n🎉 Migration completed!');
  console.log(`✅ Successfully migrated: ${migratedCount} users`);
  console.log(`❌ Errors: ${errorCount} users`);
  console.log('\n⚠️  Important: All existing sessions have been invalidated.');
  console.log('Users will need to sign in again with Google OAuth.');
}

migrateFromClerk()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 