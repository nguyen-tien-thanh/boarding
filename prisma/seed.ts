import { PrismaClient } from '@prisma/client';
import * as QRCode from 'qrcode';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const systemUserId = 1;

  // Create houses
  const house1 = await prisma.house.create({
    data: {
      name: 'Sunny Villa Boarding House',
      address: '123 Main Street, District 1, Ho Chi Minh City',
      ownerId: 1,
      description: 'Modern boarding house with excellent facilities',
      totalArea: 500.0,
      totalRooms: 4,
      status: 'ACTIVE',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  const house2 = await prisma.house.create({
    data: {
      name: 'Green Garden Residence',
      address: '456 Oak Avenue, District 7, Ho Chi Minh City',
      ownerId: 2,
      description: 'Peaceful boarding house surrounded by gardens',
      totalArea: 350.0,
      totalRooms: 3,
      status: 'ACTIVE',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  console.log('✅ Houses created');

  // Create QR codes for houses
  const house1QrData = JSON.stringify({
    houseId: house1.id,
    name: house1.name,
    type: 'house_info',
  });

  const house1QrImage = await QRCode.toDataURL(house1QrData);

  await prisma.qRCode.create({
    data: {
      houseId: house1.id,
      qrData: house1QrData,
      imageUrl: house1QrImage,
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  console.log('✅ QR Codes created');

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: 'Premium Room A1',
        roomNumber: 'A1',
        area: 25.0,
        baseRent: 3500000,
        houseId: house1.id,
        description: 'Spacious premium room with balcony',
        status: 'AVAILABLE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Standard Room A2',
        roomNumber: 'A2',
        area: 20.0,
        baseRent: 3000000,
        houseId: house1.id,
        description: 'Comfortable room with natural light',
        status: 'OCCUPIED',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Garden View Room G1',
        roomNumber: 'G1',
        area: 22.0,
        baseRent: 3200000,
        houseId: house2.id,
        description: 'Room with beautiful garden view',
        status: 'AVAILABLE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ Rooms created');

  // Create asset categories
  const categories = await Promise.all([
    prisma.assetCategory.create({
      data: {
        name: 'FURNITURE',
        description: 'Furniture and fixtures',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.assetCategory.create({
      data: {
        name: 'ELECTRONICS',
        description: 'Electronic devices and appliances',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  // Create assets
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: 'Air Conditioner',
        categoryId: categories[1].id,
        condition: 'GOOD',
        value: 8000000,
        description: 'Energy-efficient air conditioner',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Single Bed',
        categoryId: categories[0].id,
        condition: 'NEW',
        value: 2500000,
        description: 'Comfortable single bed with mattress',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Study Desk',
        categoryId: categories[0].id,
        condition: 'GOOD',
        value: 1500000,
        description: 'Modern study desk with drawers',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ Assets created');

  // Assign assets to rooms
  await Promise.all([
    prisma.roomAsset.create({
      data: {
        roomId: rooms[0].id,
        assetId: assets[0].id,
        quantity: 1,
        condition: 'GOOD',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.roomAsset.create({
      data: {
        roomId: rooms[0].id,
        assetId: assets[1].id,
        quantity: 1,
        condition: 'NEW',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.roomAsset.create({
      data: {
        roomId: rooms[1].id,
        assetId: assets[1].id,
        quantity: 1,
        condition: 'GOOD',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.roomAsset.create({
      data: {
        roomId: rooms[1].id,
        assetId: assets[2].id,
        quantity: 1,
        condition: 'GOOD',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ Room assets assigned');

  // Create tenant contract
  await prisma.tenantContract.create({
    data: {
      tenantId: 1,
      roomId: rooms[1].id,
      monthlyRent: 3000000,
      deposit: 6000000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      terms: 'Standard rental agreement with monthly payment',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  console.log('✅ Tenant contract created');

  // Create maintenance request
  await prisma.maintenance.create({
    data: {
      roomId: rooms[1].id,
      reportedBy: 1,
      assignedTo: 2,
      title: 'Air conditioner maintenance',
      description: 'Regular cleaning and maintenance of AC unit',
      priority: 'MEDIUM',
      status: 'REPORTED',
      cost: 500000,
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  console.log('✅ Maintenance request created');

  // Create room images
  await Promise.all([
    prisma.image.create({
      data: {
        imageUrl: 'https://example.com/images/room-a1.jpg',
        entityType: 'ROOM',
        entityId: rooms[0].id,
        isPrimary: true,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.image.create({
      data: {
        imageUrl: 'https://example.com/images/room-a2.jpg',
        entityType: 'ROOM',
        entityId: rooms[1].id,
        isPrimary: true,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ Images created');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log('   - 2 Houses');
  console.log('   - 1 QR Code');
  console.log('   - 3 Rooms');
  console.log('   - 2 Asset Categories');
  console.log('   - 3 Assets');
  console.log('   - 4 Room-Asset assignments');
  console.log('   - 1 Tenant Contract');
  console.log('   - 1 Maintenance Request');
  console.log('   - 2 Room Images');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
