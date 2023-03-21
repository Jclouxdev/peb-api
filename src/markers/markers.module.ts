import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkerEntity } from './marker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarkerEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class MarkersModule {}
