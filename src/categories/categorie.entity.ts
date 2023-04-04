import { MarkerEntity } from '../markers/marker.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('categorie')
export class CategorieEntity {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @OneToMany(() => MarkerEntity, (marker) => marker.categorie)
  markers: MarkerEntity[];
}
