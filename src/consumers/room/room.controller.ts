import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @MessagePattern('createRoom')
  create(@Payload() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @MessagePattern('findAllRoom')
  findAll() {
    return this.roomService.findAll();
  }

  @MessagePattern('findOneRoom')
  findOne(@Payload() id: number) {
    return this.roomService.findOne(id);
  }

  @MessagePattern('updateRoom')
  update(@Payload() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(updateRoomDto.id, updateRoomDto);
  }

  @MessagePattern('removeRoom')
  remove(@Payload() id: number) {
    return this.roomService.remove(id);
  }
}
