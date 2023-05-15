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

  @Column('decimal', { nullable: false, precision: 6, scale: 2 })
  lat: number;

  @Column('decimal', { nullable: false, precision: 6, scale: 2 })
  lon: number;

  @Column({ nullable: true, length: 200 })
  description: string;

  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable()
  users: UserEntity[];

  @ManyToOne(() => CategorieEntity, (categorie) => categorie.markers)
  categorie: CategorieEntity;
}
