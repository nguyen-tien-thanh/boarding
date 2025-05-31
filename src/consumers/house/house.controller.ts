import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @MessagePattern('createHouse')
  create(@Payload() createHouseDto: CreateHouseDto) {
    return this.houseService.create(createHouseDto);
  }

  @MessagePattern('findAllHouse')
  findAll() {
    return this.houseService.findAll();
  }

  @MessagePattern('findOneHouse')
  findOne(@Payload() id: number) {
    return this.houseService.findOne(id);
  }

  @MessagePattern('updateHouse')
  update(@Payload() updateHouseDto: UpdateHouseDto) {
    return this.houseService.update(updateHouseDto.id, updateHouseDto);
  }

  @MessagePattern('removeHouse')
  remove(@Payload() id: number) {
    return this.houseService.remove(id);
  }
}
