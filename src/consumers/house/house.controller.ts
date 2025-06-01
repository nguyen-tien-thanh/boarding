import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { AutoRpcPattern, Filter, IFilter } from 'src/common/decorators';

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @AutoRpcPattern()
  async create(@Payload() createHouseDto: CreateHouseDto) {
    return this.houseService.create(createHouseDto);
  }

  @AutoRpcPattern()
  async findAll(@Filter() filter: IFilter) {
    return this.houseService.findAll(filter);
  }

  @AutoRpcPattern()
  async findOne(@Payload() data: { id: number }) {
    return this.houseService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() updateHouseDto: UpdateHouseDto) {
    return this.houseService.update(updateHouseDto.id, updateHouseDto);
  }

  @AutoRpcPattern()
  async remove(@Payload() id: number) {
    return this.houseService.remove(id);
  }
}
