import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { ShareMarkerDto } from './dto/share-marker-dto';

@Controller('markers')
export class MarkersController {
  constructor(private readonly markerRepo: MarkersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getMyMarkers(@Request() req) {
    return this.markerRepo.getMyMarkers(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createMarker(
    @Request() req,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    markerDto: CreateMarkerDto,
  ) {
    return this.markerRepo.createMarkerWithUserId(markerDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMarkerById(@Param('id') id: string, @Request() req) {
    return this.markerRepo.getById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchById(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    markderUpdateDto: UpdateMarkerDto,
  ) {
    return this.markerRepo.patchById(id, markderUpdateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeMarker(@Param('id') id: string, @Request() req) {
    return this.markerRepo.deleteMarkerById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  shareMarker(
    @Request() req,
    @Param('id') markerId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    shareMarkerDto: ShareMarkerDto,
  ) {
    return this.markerRepo.shareMarkerToUsername(
      markerId,
      shareMarkerDto,
      req.user.id,
    );
  }
}
