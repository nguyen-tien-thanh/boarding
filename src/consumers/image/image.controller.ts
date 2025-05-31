import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @MessagePattern('createImage')
  create(@Payload() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @MessagePattern('findAllImage')
  findAll() {
    return this.imageService.findAll();
  }

  @MessagePattern('findOneImage')
  findOne(@Payload() id: number) {
    return this.imageService.findOne(id);
  }

  @MessagePattern('updateImage')
  update(@Payload() updateImageDto: UpdateImageDto) {
    return this.imageService.update(updateImageDto.id, updateImageDto);
  }

  @MessagePattern('removeImage')
  remove(@Payload() id: number) {
    return this.imageService.remove(id);
  }
}
