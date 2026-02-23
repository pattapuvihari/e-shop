import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(createUserDto: CreateUserDto & {
        role?: string;
    }): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    login(loginUserDto: any): Promise<{
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        role: string;
        gender: string;
        dateOfBirth: Date;
    }>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
