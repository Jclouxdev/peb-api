import { MarkerEntity } from '../markers/marker.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categorie')
export class CategorieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @OneToMany(() => MarkerEntity, (marker) => marker.categorie)
  markers: MarkerEntity[];
}
