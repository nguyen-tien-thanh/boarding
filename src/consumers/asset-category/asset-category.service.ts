import { Injectable } from '@nestjs/common';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';

@Injectable()
export class AssetCategoryService {
  create(createAssetCategoryDto: CreateAssetCategoryDto) {
    return 'This action adds a new assetCategory';
  }

  findAll() {
    return `This action returns all assetCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assetCategory`;
  }

  update(id: number, updateAssetCategoryDto: UpdateAssetCategoryDto) {
    return `This action updates a #${id} assetCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} assetCategory`;
  }
}
