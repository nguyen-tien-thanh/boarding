import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoomAssetService } from './room-asset.service';
import { CreateRoomAssetDto } from './dto/create-room-asset.dto';
import { UpdateRoomAssetDto } from './dto/update-room-asset.dto';

@Controller()
export class RoomAssetController {
  constructor(private readonly roomAssetService: RoomAssetService) {}

  @MessagePattern('createRoomAsset')
  create(@Payload() createRoomAssetDto: CreateRoomAssetDto) {
    return this.roomAssetService.create(createRoomAssetDto);
  }

  @MessagePattern('findAllRoomAsset')
  findAll() {
    return this.roomAssetService.findAll();
  }

  @MessagePattern('findOneRoomAsset')
  findOne(@Payload() id: number) {
    return this.roomAssetService.findOne(id);
  }

  @MessagePattern('updateRoomAsset')
  update(@Payload() updateRoomAssetDto: UpdateRoomAssetDto) {
    return this.roomAssetService.update(updateRoomAssetDto.id, updateRoomAssetDto);
  }

  @MessagePattern('removeRoomAsset')
  remove(@Payload() id: number) {
    return this.roomAssetService.remove(id);
  }
}
