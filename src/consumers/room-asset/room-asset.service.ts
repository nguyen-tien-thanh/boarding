import { Injectable } from '@nestjs/common';
import { CreateRoomAssetDto } from './dto/create-room-asset.dto';
import { UpdateRoomAssetDto } from './dto/update-room-asset.dto';

@Injectable()
export class RoomAssetService {
  create(createRoomAssetDto: CreateRoomAssetDto) {
    return 'This action adds a new roomAsset';
  }

  findAll() {
    return `This action returns all roomAsset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomAsset`;
  }

  update(id: number, updateRoomAssetDto: UpdateRoomAssetDto) {
    return `This action updates a #${id} roomAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomAsset`;
  }
}
