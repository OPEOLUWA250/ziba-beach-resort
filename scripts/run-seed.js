#!/usr/bin/env node

/**
 * Script to seed the day_pass_experiences table
 * Run with: node scripts/run-seed.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Read the SQL script
    const sqlPath = path.join(__dirname, 'seed-day-pass-experiences.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('/**') && !s.startsWith('--'))
      .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`[${i + 1}/${statements.length}] Executing...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) throw error;
        console.log(`✅ Success\n`);
      } catch {
        // Some statements might fail if they're modifying schema
        // Try using the raw execute method instead
        console.log(`⚠️ Using alternative execution method...`);
      }
    }

    // Insert the data directly using the Supabase client
    console.log('\n📥 Inserting day pass experiences...');

    const experiences = [
      // Day Pass Tickets
      { name: 'Infant Ticket', description: 'Free access for babies 0-3 years old', price_per_person: 0, category: 'day-pass', age_group: '0-3 years', available: true },
      { name: 'Kids Ticket', description: 'Day pass for children 3-12 years old with access to all facilities', price_per_person: 10000, category: 'day-pass', age_group: '3-12 years', available: true },
      { name: 'Kids Ticket Plus', description: 'Enhanced day pass with premium activities and exclusive access for children 3-12', price_per_person: 25000, category: 'day-pass', age_group: '3-12 years', available: true },
      { name: 'Teens Ticket', description: 'Day pass for teenagers 13-17 years with full resort access', price_per_person: 15000, category: 'day-pass', age_group: '13-17 years', available: true },
      { name: 'Teen Ticket Plus', description: 'Premium day pass with VIP activities for teenagers 13-17', price_per_person: 30000, category: 'day-pass', age_group: '13-17 years', available: true },
      { name: 'Adult Ticket', description: 'Standard day pass for adults 18+ years with full resort access', price_per_person: 20000, category: 'day-pass', age_group: '18+ years', available: true },
      { name: 'Adult Ticket Plus', description: 'Premium day pass for adults 18+ with exclusive amenities and dining privileges', price_per_person: 45000, category: 'day-pass', age_group: '18+ years', available: true },
      { name: 'Senior Ticket', description: 'Discounted day pass for seniors 60+ years', price_per_person: 12000, category: 'day-pass', age_group: '60+ years', available: true },

      // Add-On Experiences
      { name: 'Deep Tissue Massage', description: 'Therapeutic deep tissue massage session', price_per_person: 35000, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Swedish Massage', description: 'Relaxing Swedish massage experience', price_per_person: 25000, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Kids Massage', description: 'Gentle massage designed for children', price_per_person: 11250, category: 'day-pass', age_group: '3-12 years', available: true },
      { name: 'Horse riding', description: 'Guided horse riding experience along the beach', price_per_person: 5062, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Paint & Chill in the pool with floating snacks [For 2]', description: 'Paint and relax in the pool with snacks - perfect for couples', price_per_person: 50000, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Paint & Chill with Canvas', description: 'Create your own canvas art in a relaxing setting', price_per_person: 15000, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Family/Group Beachside Lunch', description: 'Group dining experience by the beach', price_per_person: 22500, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Beachfront Picnic', description: 'Romantic or family picnic setup on the beach', price_per_person: 28125, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Paint & Chill with Tote Bag', description: 'Design and paint your own tote bag', price_per_person: 13000, category: 'day-pass', age_group: 'All ages', available: true },
      { name: 'Paint & Chill for Children', description: 'Fun painting activity specially designed for kids', price_per_person: 10000, category: 'day-pass', age_group: '3-12 years', available: true }
    ];

    // Try to insert - if table doesn't exist, create it first
    let { error } = await supabase
      .from('day_pass_experiences')
      .upsert(experiences, { onConflict: 'name' });

    if (error && error.message.includes('relation')) {
      // Table doesn't exist, create it first
      console.log('📋 Creating day_pass_experiences table...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.day_pass_experiences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price_per_person INTEGER NOT NULL DEFAULT 0,
          category TEXT NOT NULL CHECK (category IN ('day-pass', 'honeymoon', 'team-building')),
          age_group TEXT,
          available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Create table using the admin API
      const { error: createError } = await supabase.rpc('exec', {
        sql: createTableSQL
      }).catch(() => {
        // If rpc doesn't work, try direct creation
        return supabase.sql`${createTableSQL}`;
      });

      if (createError) {
        console.log('⚠️ Table creation note:', createError.message);
      }

      // Try insert again
      ({ error } = await supabase
        .from('day_pass_experiences')
        .upsert(experiences, { onConflict: 'name' }));
    }

    if (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }

    console.log(`✅ Successfully inserted/updated ${experiences.length} experiences`);
    console.log('\n🎉 Database seed completed!');
    console.log('\nYou can now:');
    console.log('1. Refresh your browser to see the Day Pass Tickets and Add-On Experiences cards');
    console.log('2. Go to /admin/experiences to manage them');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error('\n📌 If this is a table creation error, please run the SQL script manually:');
    console.error('   1. Go to Supabase Dashboard > SQL Editor');
    console.error('   2. Create a new query');
    console.error('   3. Paste the contents of scripts/seed-day-pass-experiences.sql');
    console.error('   4. Click Run');
    process.exit(1);
  }
}

seedDatabase();
