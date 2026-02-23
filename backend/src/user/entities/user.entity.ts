import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    phoneNumber: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    dateOfBirth: Date;
}
