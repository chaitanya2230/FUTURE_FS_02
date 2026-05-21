const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from local server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Lead = require('./models/Lead');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    // Connect to Database
    await connectDB();

    // 1. Clear Existing Data
    console.log('Clearing database...');
    await User.deleteMany({});
    await Lead.deleteMany({});

    // 2. Create Default Admin User
    console.log('Seeding admin user...');
    const adminUser = await User.create({
      name: 'Chaitanya',
      email: 'chaitanya2230@gmail.com',
      password: 'chaitu@123' // Will be automatically hashed by User.js pre-save hook
    });
    console.log(`Admin user seeded: ${adminUser.email}`);

    // 3. Create Sample Leads
    console.log('Seeding mock leads...');
    const mockLeads = [
      {
        name: 'Sarah Connor',
        email: 'sarah@cyberdyne.co',
        phone: '+1 (555) 019-2831',
        source: 'Website',
        status: 'new',
        notes: [
          { text: 'Lead submitted a form requesting a demo of the CRM dashboard.' }
        ]
      },
      {
        name: 'John Doe',
        email: 'john.doe@innovate.io',
        phone: '+1 (555) 234-5678',
        source: 'Referral',
        status: 'contacted',
        notes: [
          { text: 'Reached out via email to schedule a discovery call.' },
          { text: 'Scheduled introductory meeting for next Tuesday at 10:00 AM.' }
        ]
      },
      {
        name: 'Elon Musk',
        email: 'elon@spacex.com',
        phone: '+1 (555) 420-6969',
        source: 'LinkedIn',
        status: 'converted',
        notes: [
          { text: 'Inquired about enterprise integrations for multi-tenant accounts.' },
          { text: 'Sent formal proposal and contract agreement.' },
          { text: 'Contract signed! Upgraded lead status to Converted.' }
        ]
      },
      {
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        phone: '+1 (555) 007-1939',
        source: 'Cold Call',
        status: 'contacted',
        notes: [
          { text: 'Cold called during business hours. Showed minor interest in analytics.' }
        ]
      },
      {
        name: 'Peter Parker',
        email: 'peter@dailybugle.net',
        phone: '+1 (555) 876-5432',
        source: 'Website',
        status: 'lost',
        notes: [
          { text: 'Submitted request regarding freelance photography pricing models.' },
          { text: 'Determined our CRM tier does not support micro-freelancer custom billing fields. Lead marked as Lost.' }
        ]
      },
      {
        name: 'Tony Stark',
        email: 'tony@starkindustries.com',
        phone: '+1 (555) 300-3000',
        source: 'Referral',
        status: 'new',
        notes: [
          { text: 'Referred by Pepper Potts. High priority inquiry regarding defense contract management workflows.' }
        ]
      }
    ];

    await Lead.insertMany(mockLeads);
    console.log(`Successfully seeded ${mockLeads.length} mock leads!`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
