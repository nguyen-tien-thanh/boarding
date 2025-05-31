import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.config';
import * as QRCode from 'qrcode';

@Injectable()
export class BoardingService {
  private readonly logger = new Logger(BoardingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createHouseWithQR(houseData: any) {
    return this.prisma.$transaction(async (tx) => {
      // Create house
      const house = await tx.house.create({
        data: houseData,
      });

      // Generate QR code for the house
      const qrData = JSON.stringify({
        houseId: house.id,
        name: house.name,
        address: house.address,
        timestamp: new Date().toISOString(),
      });

      const qrCodeImageUrl = await QRCode.toDataURL(qrData);

      // Create QR code record
      const qrCode = await tx.qRCode.create({
        data: {
          houseId: house.id,
          qrData,
          imageUrl: qrCodeImageUrl,
          isActive: true,
        },
      });

      this.logger.log(`Created house ${house.id} with QR code ${qrCode.id}`);

      return { house, qrCode };
    });
  }

  async findHouseWithDetails(houseId: string) {
    return this.prisma.house.findUnique({
      where: { id: houseId },
      include: {
        rooms: {
          include: {
            images: true,
            roomAssets: {
              include: {
                asset: true,
              },
            },
            tenantContracts: {
              where: { status: 'ACTIVE' },
            },
            maintenances: {
              where: { status: { not: 'COMPLETED' } },
              orderBy: { reportedAt: 'desc' },
            },
          },
        },
        qrCode: true,
      },
    });
  }

  async findAvailableRooms(houseId?: string) {
    const where = {
      status: 'AVAILABLE' as const,
      ...(houseId && { houseId }),
    };

    return this.prisma.room.findMany({
      where,
      include: {
        house: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        images: {
          where: { isPrimary: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMaintenanceRequest(data: any) {
    const maintenance = await this.prisma.maintenance.create({
      data,
      include: {
        room: {
          include: {
            house: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(
      `Created maintenance request ${maintenance.id} for room ${maintenance.roomId}`,
    );
    return maintenance;
  }

  async updateMaintenanceStatus(
    maintenanceId: string,
    status: string,
    assignedTo?: string,
    cost?: number,
  ) {
    const updateData: any = { status };

    if (assignedTo) updateData.assignedTo = assignedTo;
    if (cost !== undefined) updateData.cost = cost;
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    return this.prisma.maintenance.update({
      where: { id: maintenanceId },
      data: updateData,
    });
  }

  async getRoomAssetsByHouse(houseId: string) {
    return this.prisma.roomAsset.findMany({
      where: {
        room: {
          houseId,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          },
        },
        asset: true,
      },
      orderBy: [{ room: { roomNumber: 'asc' } }, { asset: { name: 'asc' } }],
    });
  }

  async getMaintenanceStats(houseId?: string) {
    const where = houseId
      ? {
          room: {
            houseId,
          },
        }
      : {};

    const [total, reported, inProgress, completed] = await Promise.all([
      this.prisma.maintenance.count({ where }),
      this.prisma.maintenance.count({
        where: { ...where, status: 'REPORTED' },
      }),
      this.prisma.maintenance.count({
        where: { ...where, status: 'IN_PROGRESS' },
      }),
      this.prisma.maintenance.count({
        where: { ...where, status: 'COMPLETED' },
      }),
    ]);

    return {
      total,
      reported,
      inProgress,
      completed,
      pending: reported + inProgress,
    };
  }
}
