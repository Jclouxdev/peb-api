import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CategorieEntity } from '../categories/categorie.entity';
import { ManyToOne } from 'typeorm';

@Entity('marker')
export class MarkerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ nullable: false })
  lat: number;

  @Column({ nullable: false })
  lon: number;

  @Column({ nullable: true, length: 200 })
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @ManyToOne(() => CategorieEntity, (categorie) => categorie.markers)
  categorie: CategorieEntity;
}
