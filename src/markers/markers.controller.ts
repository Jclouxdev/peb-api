import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CreateMarkerDto } from './dto/create-marker.dto';

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
}
