import { HouseStatus, Prisma } from '@prisma/client';

export class House {
  id: number;
  name: string;
  address: string;
  ownerId: string;
  description: string | null;
  totalArea: Prisma.Decimal;
  totalRooms: number;
  status: HouseStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
}
