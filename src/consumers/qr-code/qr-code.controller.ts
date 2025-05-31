import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';

@Controller()
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @MessagePattern('createQrCode')
  create(@Payload() createQrCodeDto: CreateQrCodeDto) {
    return this.qrCodeService.create(createQrCodeDto);
  }

  @MessagePattern('findAllQrCode')
  findAll() {
    return this.qrCodeService.findAll();
  }

  @MessagePattern('findOneQrCode')
  findOne(@Payload() id: number) {
    return this.qrCodeService.findOne(id);
  }

  @MessagePattern('updateQrCode')
  update(@Payload() updateQrCodeDto: UpdateQrCodeDto) {
    return this.qrCodeService.update(updateQrCodeDto.id, updateQrCodeDto);
  }

  @MessagePattern('removeQrCode')
  remove(@Payload() id: number) {
    return this.qrCodeService.remove(id);
  }
}
