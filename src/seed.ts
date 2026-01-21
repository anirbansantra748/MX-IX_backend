import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Service } from './models/service.model';
import { Continent } from './models/continent.model';
import { Location } from './models/location.model';
import { ContactInfo } from './models/contactInfo.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mx-ix';

// Sample data
const continents = [
  { id: 'asia', name: 'Asia Pacific', order: 1 },
  { id: 'europe', name: 'Europe', order: 2 },
  { id: 'north-america', name: 'North America', order: 3 },
];

const locations = [
  {
    id: 'singapore',
    name: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    region: 'ASIA',
    continentId: 'asia',
    latitude: 1.3521,
    longitude: 103.8198,
    facilities: ['Equinix SG1', 'Global Switch'],
    asnList: [{ asn: 'AS64512', name: 'MX-IX Singapore' }],
    enabledSites: ['Equinix SG1'],
    pricingTiers: [
      { speed: '1G', setupFee: 500, monthlyFee: 200 },
      { speed: '10G', setupFee: 1000, monthlyFee: 800 },
    ],
    peers: 150,
    capacity: 500,
    uptime: 99.99,
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'EUROPE',
    continentId: 'europe',
    latitude: 50.1109,
    longitude: 8.6821,
    facilities: ['Interxion FRA1', 'DE-CIX'],
    asnList: [{ asn: 'AS64513', name: 'MX-IX Frankfurt' }],
    enabledSites: ['DE-CIX'],
    pricingTiers: [
      { speed: '1G', setupFee: 500, monthlyFee: 250 },
      { speed: '10G', setupFee: 1000, monthlyFee: 900 },
    ],
    peers: 200,
    capacity: 800,
    uptime: 99.98,
  },
  {
    id: 'new-york',
    name: 'New York',
    city: 'New York',
    country: 'United States',
    region: 'NORTH AMERICA',
    continentId: 'north-america',
    latitude: 40.7128,
    longitude: -74.0060,
    facilities: ['Equinix NY5', '60 Hudson Street'],
    asnList: [{ asn: 'AS64514', name: 'MX-IX New York' }],
    enabledSites: ['Equinix NY5'],
    pricingTiers: [
      { speed: '1G', setupFee: 500, monthlyFee: 300 },
      { speed: '10G', setupFee: 1000, monthlyFee: 1000 },
    ],
    peers: 180,
    capacity: 600,
    uptime: 99.97,
  },
];

const services = [
  {
    id: 'peering',
    category: 'Peering',
    tagline: 'Direct Interconnection at Scale',
    description: 'Connect directly with networks worldwide through our global peering fabric.',
    image: '',
    order: 1,
    isActive: true,
    items: [
      {
        name: 'Bilateral Peering',
        description: 'Direct private interconnection between two networks',
        icon: 'bilateral-peering',
        benefits: [
          'Reduced latency',
          'Lower transit costs',
          'Improved network performance',
          'Direct control over routing',
        ],
        features: [
          '1G to 100G port speeds',
          'BGP session management',
          '24/7 NOC support',
          'Real-time traffic analytics',
        ],
        order: 1,
      },
      {
        name: 'Public Peering',
        description: 'Exchange traffic with multiple networks simultaneously',
        icon: 'public-peering',
        benefits: [
          'Cost-effective scaling',
          'Access to hundreds of networks',
          'Simplified operations',
          'Reduced complexity',
        ],
        features: [
          'Route server support',
          'IPv4 and IPv6',
          'Looking glass access',
          'Peering coordinator support',
        ],
        order: 2,
      },
      {
        name: 'Private Interconnect',
        description: 'Secure dedicated infrastructure for exclusive network connections',
        icon: 'private-interconnect',
        benefits: [
          'Maximum security and privacy',
          'Guaranteed bandwidth',
          'Customizable configurations',
          'SLA-backed performance',
        ],
        features: [
          'Dedicated fiber connections',
          'Point-to-point encryption',
          'Custom routing policies',
          'Priority support',
        ],
        order: 3,
      },
    ],
  },
  {
    id: 'cloud',
    category: 'Cloud',
    tagline: 'Direct Path to Cloud Providers',
    description: 'Seamless connectivity to major cloud platforms with dedicated, low-latency connections.',
    image: '',
    order: 2,
    isActive: true,
    items: [
      {
        name: 'AWS Direct Connect',
        description: 'Dedicated network connection to Amazon Web Services',
        icon: 'cloud',
        benefits: [
          'Consistent network performance',
          'Reduced bandwidth costs',
          'Private connectivity',
          'Hybrid cloud enablement',
        ],
        features: [
          '1G to 100G connections',
          'Multiple VIF support',
          'BGP routing',
          'Redundancy options',
        ],
        order: 1,
      },
    ],
  },
  {
    id: 'security',
    category: 'Security',
    tagline: 'Advanced Threat Protection',
    description: 'Comprehensive security solutions to protect your network infrastructure.',
    image: '',
    order: 3,
    isActive: true,
    items: [
      {
        name: 'Anti-DDoS',
        description: 'Real-time volumetric attack mitigation with ML-powered threat detection',
        icon: 'ddos-shield',
        benefits: [
          'Scrubbing capacity: 10+ Tbps',
          'Detection time: <30 seconds',
          'Mitigation time: <60 seconds',
          'Zero false positives',
        ],
        features: [
          'Layer 3-7 protection',
          'Always-on monitoring',
          'Instant traffic rerouting',
          'Post-attack analytics',
        ],
        order: 1,
      },
    ],
  },
];

const contacts = [
  {
    department: 'sales',
    locationId: 'global',
    phone: '+1 (555) 100-2000',
    email: 'sales@mx-ix.com',
  },
  {
    department: 'support',
    locationId: 'global',
    phone: '+1 (555) 100-3000',
    email: 'support@mx-ix.com',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      Service.deleteMany({}),
      Continent.deleteMany({}),
      Location.deleteMany({}),
      ContactInfo.deleteMany({}),
    ]);
    console.log('✅ Cleared existing data');

    // Seed continents
    console.log('\n🌍 Seeding continents...');
    const createdContinents = await Continent.insertMany(continents);
    console.log(`✅ Created ${createdContinents.length} continents`);

    // Seed locations
    console.log('\n📍 Seeding locations...');
    const createdLocations = await Location.insertMany(locations);
    console.log(`✅ Created ${createdLocations.length} locations`);

    // Seed services
    console.log('\n🔧 Seeding services...');
    const createdServices = await Service.insertMany(services);
    console.log(`✅ Created ${createdServices.length} services`);

    // Seed contacts
    console.log('\n📞 Seeding contacts...');
    const createdContacts = await ContactInfo.insertMany(contacts);
    console.log(`✅ Created ${createdContacts.length} contacts`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Continents: ${createdContinents.length}`);
    console.log(`   - Locations: ${createdLocations.length}`);
    console.log(`   - Services: ${createdServices.length}`);
    console.log(`   - Contacts: ${createdContacts.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
