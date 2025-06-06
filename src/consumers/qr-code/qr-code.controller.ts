import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QRCodeService } from './qr-code.service';
import { CreateQRCodeDto, UpdateQRCodeDto } from './qr-code.dto';

@Controller()
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @MessagePattern('createQRCode')
  create(@Payload() createQRCodeDto: CreateQRCodeDto) {
    return this.qrCodeService.create(createQRCodeDto);
  }

  @MessagePattern('findAllQRCode')
  findAll() {
    return this.qrCodeService.findAll();
  }

  @MessagePattern('findOneQRCode')
  findOne(@Payload() id: number) {
    return this.qrCodeService.findOne(id);
  }

  @MessagePattern('updateQRCode')
  update(@Payload() payload: { id: number; data: UpdateQRCodeDto }) {
    return this.qrCodeService.update(payload.id, payload.data);
  }

  @MessagePattern('removeQRCode')
  remove(@Payload() id: number) {
    return this.qrCodeService.remove(id);
  }
}
