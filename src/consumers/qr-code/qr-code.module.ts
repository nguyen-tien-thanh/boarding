import { Module } from '@nestjs/common';
import { QRCodeService } from './qr-code.service';
import { QRCodeController } from './qr-code.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [QRCodeController],
  providers: [QRCodeService, PrismaService],
  exports: [QRCodeService],
})
export class QRCodeModule {}
