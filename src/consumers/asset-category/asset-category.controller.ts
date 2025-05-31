import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AssetCategoryService } from './asset-category.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';

@Controller()
export class AssetCategoryController {
  constructor(private readonly assetCategoryService: AssetCategoryService) {}

  @MessagePattern('createAssetCategory')
  create(@Payload() createAssetCategoryDto: CreateAssetCategoryDto) {
    return this.assetCategoryService.create(createAssetCategoryDto);
  }

  @MessagePattern('findAllAssetCategory')
  findAll() {
    return this.assetCategoryService.findAll();
  }

  @MessagePattern('findOneAssetCategory')
  findOne(@Payload() id: number) {
    return this.assetCategoryService.findOne(id);
  }

  @MessagePattern('updateAssetCategory')
  update(@Payload() updateAssetCategoryDto: UpdateAssetCategoryDto) {
    return this.assetCategoryService.update(updateAssetCategoryDto.id, updateAssetCategoryDto);
  }

  @MessagePattern('removeAssetCategory')
  remove(@Payload() id: number) {
    return this.assetCategoryService.remove(id);
  }
}
