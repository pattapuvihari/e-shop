import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  color: string;

  @Column('text', { nullable: true })
  fullDescription: string;

  @Column('json', { nullable: true })
  specifications: Record<string, string>;

  @Column({ nullable: true })
  discount: number;
}
