import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @MessagePattern('createAsset')
  create(@Payload() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @MessagePattern('findAllAsset')
  findAll() {
    return this.assetService.findAll();
  }

  @MessagePattern('findOneAsset')
  findOne(@Payload() id: number) {
    return this.assetService.findOne(id);
  }

  @MessagePattern('updateAsset')
  update(@Payload() updateAssetDto: UpdateAssetDto) {
    return this.assetService.update(updateAssetDto.id, updateAssetDto);
  }

  @MessagePattern('removeAsset')
  remove(@Payload() id: number) {
    return this.assetService.remove(id);
  }
}
