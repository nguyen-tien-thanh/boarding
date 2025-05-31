import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Controller()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @MessagePattern('createMaintenance')
  create(@Payload() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @MessagePattern('findAllMaintenance')
  findAll() {
    return this.maintenanceService.findAll();
  }

  @MessagePattern('findOneMaintenance')
  findOne(@Payload() id: number) {
    return this.maintenanceService.findOne(id);
  }

  @MessagePattern('updateMaintenance')
  update(@Payload() updateMaintenanceDto: UpdateMaintenanceDto) {
    return this.maintenanceService.update(updateMaintenanceDto.id, updateMaintenanceDto);
  }

  @MessagePattern('removeMaintenance')
  remove(@Payload() id: number) {
    return this.maintenanceService.remove(id);
  }
}
