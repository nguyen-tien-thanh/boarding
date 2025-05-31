import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { PrismaService } from '../config/prisma.config';

@Controller()
export class BoardingConsumer {
  private readonly logger = new Logger(BoardingConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @EventPattern('house.created')
  async handleHouseCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('Received house.created event', data);

    try {
      const house = await this.prisma.house.create({
        data: {
          name: data.name,
          address: data.address,
          ownerId: data.ownerId,
          description: data.description,
          totalArea: data.totalArea,
          totalRooms: data.totalRooms,
          status: data.status || 'ACTIVE',
        },
      });

      this.logger.log(`House created successfully with ID: ${house.id}`);

      // Acknowledge message
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error('Failed to create house', error);
      // Reject message and requeue
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('house.updated')
  async handleHouseUpdated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('Received house.updated event', data);

    try {
      const house = await this.prisma.house.update({
        where: { id: data.id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.address && { address: data.address }),
          ...(data.ownerId && { ownerId: data.ownerId }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.totalArea && { totalArea: data.totalArea }),
          ...(data.totalRooms && { totalRooms: data.totalRooms }),
          ...(data.status && { status: data.status }),
        },
      });

      this.logger.log(`House updated successfully with ID: ${house.id}`);

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error('Failed to update house', error);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('room.created')
  async handleRoomCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('Received room.created event', data);

    try {
      const room = await this.prisma.room.create({
        data: {
          name: data.name,
          roomNumber: data.roomNumber,
          area: data.area,
          baseRent: data.baseRent,
          houseId: data.houseId,
          description: data.description,
          status: data.status || 'AVAILABLE',
        },
      });

      this.logger.log(`Room created successfully with ID: ${room.id}`);

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error('Failed to create room', error);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('maintenance.created')
  async handleMaintenanceCreated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log('Received maintenance.created event', data);

    try {
      const maintenance = await this.prisma.maintenance.create({
        data: {
          roomId: data.roomId,
          reportedBy: data.reportedBy,
          assignedTo: data.assignedTo,
          title: data.title,
          description: data.description,
          priority: data.priority || 'MEDIUM',
          status: data.status || 'REPORTED',
          cost: data.cost,
        },
      });

      this.logger.log(
        `Maintenance created successfully with ID: ${maintenance.id}`,
      );

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error('Failed to create maintenance', error);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('qr.generated')
  async handleQRGenerated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('Received qr.generated event', data);

    try {
      const qrCode = await this.prisma.qRCode.create({
        data: {
          houseId: data.houseId,
          qrData: data.qrData,
          imageUrl: data.imageUrl,
          isActive: data.isActive !== undefined ? data.isActive : true,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        },
      });

      this.logger.log(`QR Code created successfully with ID: ${qrCode.id}`);

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error('Failed to create QR code', error);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }
}
