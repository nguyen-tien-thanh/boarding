import {
  PrismaClient,
  AssetCondition,
  ImageType,
  ContractStatus,
  MaintenancePriority,
  MaintenanceStatus,
} from '@prisma/client';
import * as QRCode from 'qrcode';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const systemUserId = 1; // Admin user ID

  // Create sample houses
  const house1 = await prisma.house.create({
    data: {
      name: 'Sunny Villa Boarding House',
      address: '123 Main Street, District 1, Ho Chi Minh City',
      ownerId: '550e8400-e29b-41d4-a716-446655440001',
      description:
        'A modern boarding house with excellent facilities and amenities for students and young professionals',
      totalArea: 500.0,
      totalRooms: 10,
      status: 'ACTIVE',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  const house2 = await prisma.house.create({
    data: {
      name: 'Green Garden Residence',
      address: '456 Oak Avenue, District 7, Ho Chi Minh City',
      ownerId: '550e8400-e29b-41d4-a716-446655440002',
      description:
        'Peaceful boarding house surrounded by beautiful gardens and green spaces',
      totalArea: 350.0,
      totalRooms: 8,
      status: 'ACTIVE',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  const house3 = await prisma.house.create({
    data: {
      name: 'Central City Heights',
      address: '789 Business District, District 3, Ho Chi Minh City',
      ownerId: '550e8400-e29b-41d4-a716-446655440003',
      description:
        'Premium boarding house in the heart of the business district',
      totalArea: 650.0,
      totalRooms: 15,
      status: 'ACTIVE',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  console.log('✅ Houses created successfully');

  // Create QR codes for houses
  const house1QrData = JSON.stringify({
    houseId: house1.id,
    name: house1.name,
    address: house1.address,
    timestamp: new Date().toISOString(),
    type: 'house_info',
  });

  const house2QrData = JSON.stringify({
    houseId: house2.id,
    name: house2.name,
    address: house2.address,
    timestamp: new Date().toISOString(),
    type: 'house_info',
  });

  const house1QrImage = await QRCode.toDataURL(house1QrData);
  const house2QrImage = await QRCode.toDataURL(house2QrData);

  await Promise.all([
    prisma.qRCode.create({
      data: {
        houseId: house1.id,
        qrData: house1QrData,
        imageUrl: house1QrImage,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.qRCode.create({
      data: {
        houseId: house2.id,
        qrData: house2QrData,
        imageUrl: house2QrImage,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ QR Codes created successfully');

  // Create rooms for houses
  const rooms = await Promise.all([
    // House 1 rooms
    prisma.room.create({
      data: {
        name: 'Premium Room A1',
        roomNumber: 'A1',
        area: 25.0,
        baseRent: 3500000,
        houseId: house1.id,
        description:
          'Spacious premium room with balcony, air conditioning, and modern furnishing',
        status: 'AVAILABLE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Cozy Room A2',
        roomNumber: 'A2',
        area: 20.0,
        baseRent: 3000000,
        houseId: house1.id,
        description:
          'Cozy room with natural light and comfortable living space',
        status: 'OCCUPIED',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Deluxe Room B1',
        roomNumber: 'B1',
        area: 30.0,
        baseRent: 4000000,
        houseId: house1.id,
        description:
          'Large deluxe room with private bathroom and premium amenities',
        status: 'RESERVED',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Standard Room B2',
        roomNumber: 'B2',
        area: 18.0,
        baseRent: 2800000,
        houseId: house1.id,
        description: 'Standard room with essential amenities',
        status: 'AVAILABLE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    // House 2 rooms
    prisma.room.create({
      data: {
        name: 'Garden View Room G1',
        roomNumber: 'G1',
        area: 22.0,
        baseRent: 3200000,
        houseId: house2.id,
        description:
          'Comfortable room with beautiful garden view and peaceful environment',
        status: 'AVAILABLE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Garden View Room G2',
        roomNumber: 'G2',
        area: 24.0,
        baseRent: 3400000,
        houseId: house2.id,
        description:
          'Spacious room overlooking the garden with modern facilities',
        status: 'OCCUPIED',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    // House 3 rooms
    prisma.room.create({
      data: {
        name: 'Executive Suite E1',
        roomNumber: 'E1',
        area: 35.0,
        baseRent: 5000000,
        houseId: house3.id,
        description:
          'Executive suite with workspace area and premium amenities',
        status: 'AVAILABLE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Business Room B3',
        roomNumber: 'B3',
        area: 28.0,
        baseRent: 4200000,
        houseId: house3.id,
        description:
          'Business-oriented room with high-speed internet and workspace',
        status: 'MAINTENANCE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ Rooms created successfully');

  const assetCategories = await Promise.all([
    prisma.assetCategory.create({
      data: {
        name: 'FURNITURE',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.assetCategory.create({
      data: {
        name: 'ELECTRONICS',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.assetCategory.create({
      data: {
        name: 'APPLIANCES',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.assetCategory.create({
      data: {
        name: 'UTILITIES',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.assetCategory.create({
      data: {
        name: 'DECORATION',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  // Create assets
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: 'Daikin Air Conditioner 1.5HP',
        categoryId: assetCategories[1].id,
        condition: AssetCondition.GOOD,
        value: 8000000,
        description:
          'Energy-efficient air conditioner with remote control and timer function',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Premium Single Bed',
        categoryId: assetCategories[0].id,
        condition: AssetCondition.NEW,
        value: 2500000,
        description: 'High-quality wooden single bed with orthopedic mattress',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Modern Study Desk',
        categoryId: assetCategories[0].id,
        condition: AssetCondition.GOOD,
        value: 1500000,
        description:
          'Ergonomic study desk with multiple drawers and cable management',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: '3-Door Wardrobe',
        categoryId: assetCategories[0].id,
        condition: AssetCondition.GOOD,
        value: 3000000,
        description:
          'Spacious 3-door wooden wardrobe with hanging rod and shelves',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Samsung Mini Refrigerator',
        categoryId: assetCategories[2].id,
        condition: AssetCondition.NEW,
        value: 12000000,
        description: 'Samsung 200L mini refrigerator with energy saving mode',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'LED Ceiling Light',
        categoryId: assetCategories[3].id,
        condition: AssetCondition.NEW,
        value: 800000,
        description: 'Energy-efficient LED ceiling light with dimmer function',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Office Chair',
        categoryId: assetCategories[0].id,
        condition: AssetCondition.GOOD,
        value: 1200000,
        description:
          'Ergonomic office chair with adjustable height and back support',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Wall Fan',
        categoryId: assetCategories[3].id,
        condition: AssetCondition.FAIR,
        value: 600000,
        description:
          'Wall-mounted fan with remote control and oscillation feature',
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    }),
  ]);

  console.log('✅ Assets created successfully');

  // Assign assets to rooms
  const roomAssets: Array<{
    roomId: number;
    assetId: number;
    quantity: number;
    condition: AssetCondition;
  }> = [];

  // Room A1 (Premium) - Full equipment
  roomAssets.push(
    {
      roomId: rooms[0].id,
      assetId: assets[0].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // AC
    {
      roomId: rooms[0].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Bed
    {
      roomId: rooms[0].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Desk
    {
      roomId: rooms[0].id,
      assetId: assets[3].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Wardrobe
    {
      roomId: rooms[0].id,
      assetId: assets[5].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // LED Light
    {
      roomId: rooms[0].id,
      assetId: assets[6].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Chair
  );

  // Room A2 (Occupied) - Standard equipment
  roomAssets.push(
    {
      roomId: rooms[1].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Bed
    {
      roomId: rooms[1].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Desk
    {
      roomId: rooms[1].id,
      assetId: assets[3].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Wardrobe
    {
      roomId: rooms[1].id,
      assetId: assets[7].id,
      quantity: 1,
      condition: AssetCondition.FAIR,
    }, // Wall Fan
  );

  // Room B1 (Deluxe) - Premium equipment
  roomAssets.push(
    {
      roomId: rooms[2].id,
      assetId: assets[0].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // AC
    {
      roomId: rooms[2].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Bed
    {
      roomId: rooms[2].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Desk
    {
      roomId: rooms[2].id,
      assetId: assets[4].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Refrigerator
    {
      roomId: rooms[2].id,
      assetId: assets[5].id,
      quantity: 2,
      condition: AssetCondition.NEW,
    }, // LED Lights
    {
      roomId: rooms[2].id,
      assetId: assets[6].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Chair
  );

  // Room B2 (Standard) - Basic equipment
  roomAssets.push(
    {
      roomId: rooms[3].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Bed
    {
      roomId: rooms[3].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.FAIR,
    }, // Desk
    {
      roomId: rooms[3].id,
      assetId: assets[7].id,
      quantity: 1,
      condition: AssetCondition.FAIR,
    }, // Wall Fan
  );

  // Room G1 (Garden View) - Standard equipment
  roomAssets.push(
    {
      roomId: rooms[4].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Bed
    {
      roomId: rooms[4].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Desk
    {
      roomId: rooms[4].id,
      assetId: assets[3].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Wardrobe
    {
      roomId: rooms[4].id,
      assetId: assets[0].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // AC
  );

  // Room G2 (Garden View, Occupied) - Standard equipment
  roomAssets.push(
    {
      roomId: rooms[5].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Bed
    {
      roomId: rooms[5].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Desk
    {
      roomId: rooms[5].id,
      assetId: assets[3].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Wardrobe
    {
      roomId: rooms[5].id,
      assetId: assets[0].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // AC
  );

  // Room E1 (Executive Suite) - Premium equipment
  roomAssets.push(
    {
      roomId: rooms[6].id,
      assetId: assets[0].id,
      quantity: 2,
      condition: AssetCondition.NEW,
    }, // AC x2
    {
      roomId: rooms[6].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Bed
    {
      roomId: rooms[6].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Desk
    {
      roomId: rooms[6].id,
      assetId: assets[4].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Refrigerator
    {
      roomId: rooms[6].id,
      assetId: assets[6].id,
      quantity: 1,
      condition: AssetCondition.NEW,
    }, // Chair
  );

  // Room B3 (Maintenance) - Equipment with issues
  roomAssets.push(
    {
      roomId: rooms[7].id,
      assetId: assets[1].id,
      quantity: 1,
      condition: AssetCondition.GOOD,
    }, // Bed
    {
      roomId: rooms[7].id,
      assetId: assets[2].id,
      quantity: 1,
      condition: AssetCondition.FAIR,
    }, // Desk
    {
      roomId: rooms[7].id,
      assetId: assets[0].id,
      quantity: 1,
      condition: AssetCondition.POOR,
    }, // AC (needs repair)
  );

  await Promise.all(
    roomAssets.map((ra) =>
      prisma.roomAsset.create({
        data: {
          ...ra,
          createdBy: systemUserId,
          updatedBy: systemUserId,
        },
      }),
    ),
  );

  console.log('✅ Room assets assigned successfully');

  // Create room images
  const roomImages: Array<{
    roomId: number;
    imageUrl: string;
    imageType: ImageType;
    isPrimary: boolean;
  }> = [
    // Room A1 images
    {
      roomId: rooms[0].id,
      imageUrl: 'https://example.com/images/room-a1-main.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: true,
    },
    {
      roomId: rooms[0].id,
      imageUrl: 'https://example.com/images/room-a1-interior.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: false,
    },
    {
      roomId: rooms[0].id,
      imageUrl: 'https://example.com/images/room-a1-facility.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: false,
    },

    // Room A2 images
    {
      roomId: rooms[1].id,
      imageUrl: 'https://example.com/images/room-a2-main.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: true,
    },
    {
      roomId: rooms[1].id,
      imageUrl: 'https://example.com/images/room-a2-interior.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: false,
    },

    // Room B1 images
    {
      roomId: rooms[2].id,
      imageUrl: 'https://example.com/images/room-b1-main.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: true,
    },
    {
      roomId: rooms[2].id,
      imageUrl: 'https://example.com/images/room-b1-bathroom.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: false,
    },

    // Room G1 images
    {
      roomId: rooms[4].id,
      imageUrl: 'https://example.com/images/room-g1-main.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: true,
    },
    {
      roomId: rooms[4].id,
      imageUrl: 'https://example.com/images/room-g1-garden-view.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: false,
    },

    // Room G2 images
    {
      roomId: rooms[5].id,
      imageUrl: 'https://example.com/images/room-g2-main.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: true,
    },

    // Room E1 images
    {
      roomId: rooms[6].id,
      imageUrl: 'https://example.com/images/room-e1-main.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: true,
    },
    {
      roomId: rooms[6].id,
      imageUrl: 'https://example.com/images/room-e1-workspace.jpg',
      imageType: ImageType.ROOM_PHOTO,
      isPrimary: false,
    },
  ];

  await Promise.all(
    roomImages.map((img) =>
      prisma.image.create({
        data: {
          ...img,
          createdBy: systemUserId,
          updatedBy: systemUserId,
        },
      }),
    ),
  );

  console.log('✅ Room images created successfully');

  // Create tenant contracts
  const contracts: Array<{
    tenantId: string;
    roomId: number;
    monthlyRent: number;
    deposit: number;
    startDate: Date;
    endDate: Date;
    status: ContractStatus;
    terms: string;
  }> = [
    // Room A2 (Occupied) - Active contract
    {
      tenantId: '550e8400-e29b-41d4-a716-446655440010',
      roomId: rooms[1].id,
      monthlyRent: 3000000,
      deposit: 6000000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: ContractStatus.ACTIVE,
      terms:
        'Standard rental agreement with monthly payment due on 1st of each month. Includes utilities (water, electricity up to 100kWh). No pets allowed.',
    },
    // Room G2 (Occupied) - Active contract
    {
      tenantId: '550e8400-e29b-41d4-a716-446655440011',
      roomId: rooms[5].id,
      monthlyRent: 3400000,
      deposit: 6800000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
      status: ContractStatus.ACTIVE,
      terms:
        'Standard rental agreement with garden access. Monthly payment due on 1st. Utilities included up to reasonable usage.',
    },
    // Room B1 (Reserved) - Pending contract
    {
      tenantId: '550e8400-e29b-41d4-a716-446655440012',
      roomId: rooms[2].id,
      monthlyRent: 4000000,
      deposit: 8000000,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-02-28'),
      status: ContractStatus.PENDING,
      terms:
        'Premium room contract with private bathroom. Contract pending tenant verification and first payment. All utilities included.',
    },
    // Expired contract example
    {
      tenantId: '550e8400-e29b-41d4-a716-446655440013',
      roomId: rooms[3].id,
      monthlyRent: 2800000,
      deposit: 5600000,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      status: ContractStatus.EXPIRED,
      terms:
        'Standard rental agreement. Contract has expired and tenant has moved out.',
    },
  ];

  await Promise.all(
    contracts.map((contract) =>
      prisma.tenantContract.create({
        data: {
          ...contract,
          createdBy: systemUserId,
          updatedBy: systemUserId,
        },
      }),
    ),
  );

  console.log('✅ Tenant contracts created successfully');

  // Create maintenance requests
  const maintenanceRequests: Array<{
    roomId: number;
    reportedBy: number;
    assignedTo?: number;
    title: string;
    description: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    cost?: number;
    completedAt?: Date;
  }> = [
    // High priority - AC not cooling in occupied room
    {
      roomId: rooms[1].id, // Room A2 (occupied)
      reportedBy: 2, // Tenant user ID
      assignedTo: 3, // Maintenance staff ID
      title: 'Air conditioner not cooling properly',
      description:
        'The wall fan in room A2 is making unusual noise and not providing adequate cooling. Tenant reports room temperature remains high even with fan running continuously.',
      priority: MaintenancePriority.HIGH,
      status: MaintenanceStatus.IN_PROGRESS,
      cost: 500000,
    },
    // Urgent - AC repair needed in maintenance room
    {
      roomId: rooms[7].id, // Room B3 (maintenance)
      reportedBy: 1, // House manager
      assignedTo: 3, // Maintenance staff ID
      title: 'Air conditioner compressor failure',
      description:
        'Air conditioning unit in room B3 has complete compressor failure. Unit is not cooling at all and making loud noises. Needs immediate replacement or major repair.',
      priority: MaintenancePriority.URGENT,
      status: MaintenanceStatus.REPORTED,
      cost: 15000000,
    },
    // Low priority - Light bulb replacement
    {
      roomId: rooms[0].id, // Room A1
      reportedBy: 1, // House manager
      title: 'LED ceiling light replacement needed',
      description:
        'One of the LED ceiling lights in room A1 has burned out and needs replacement. Room has backup lighting.',
      priority: MaintenancePriority.LOW,
      status: MaintenanceStatus.REPORTED,
    },
    // Medium priority - Plumbing issue
    {
      roomId: rooms[2].id, // Room B1
      reportedBy: 1, // House manager
      assignedTo: 4, // Plumber ID
      title: 'Bathroom faucet leaking',
      description:
        'Private bathroom faucet in room B1 has developed a slow leak. Water is dripping constantly and needs repair to prevent water waste.',
      priority: MaintenancePriority.MEDIUM,
      status: MaintenanceStatus.REPORTED,
    },
    // Completed maintenance
    {
      roomId: rooms[5].id, // Room G2 (occupied)
      reportedBy: 2, // Tenant
      assignedTo: 3, // Maintenance staff
      title: 'Door lock replacement completed',
      description:
        'Room door lock was broken and tenant could not secure the room properly. Lock has been replaced with new high-security model.',
      priority: MaintenancePriority.URGENT,
      status: MaintenanceStatus.COMPLETED,
      cost: 300000,
      completedAt: new Date('2024-01-15'),
    },
    // Garden maintenance
    {
      roomId: rooms[4].id, // Room G1 (garden view)
      reportedBy: 1, // House manager
      assignedTo: 5, // Gardener ID
      title: 'Garden view obstructed by overgrown plants',
      description:
        'Plants outside room G1 have grown too tall and are blocking the garden view that is advertised as a feature of this room.',
      priority: MaintenancePriority.LOW,
      status: MaintenanceStatus.IN_PROGRESS,
      cost: 200000,
    },
  ];

  await Promise.all(
    maintenanceRequests.map((maintenance) =>
      prisma.maintenance.create({
        data: {
          ...maintenance,
          createdBy: systemUserId,
          updatedBy: systemUserId,
        },
      }),
    ),
  );

  console.log('✅ Maintenance requests created successfully');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('📊 Summary of created records:');
  console.log(`   - ${3} Houses (Sunny Villa, Green Garden, Central Heights)`);
  console.log(`   - ${2} QR Codes (with expiration dates)`);
  console.log(`   - ${8} Rooms (various types and statuses)`);
  console.log(`   - ${8} Assets (furniture, electronics, appliances)`);
  console.log(`   - ${22} Room-Asset assignments`);
  console.log(`   - ${12} Room Images (multiple types per room)`);
  console.log(`   - ${4} Tenant Contracts (active, pending, expired)`);
  console.log(
    `   - ${6} Maintenance Requests (various priorities and statuses)`,
  );
  console.log('\n💡 You can now:');
  console.log('   - View data with: npm run studio');
  console.log('   - Test the microservice endpoints');
  console.log('   - Send RabbitMQ messages to test the consumer');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
