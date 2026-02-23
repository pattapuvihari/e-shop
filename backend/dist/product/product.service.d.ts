import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity/product.entity';
export declare class ProductService implements OnModuleInit {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
    findAll(query: any): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    create(product: Partial<Product>): Promise<Product>;
    update(id: number, product: Partial<Product>): Promise<Product>;
    remove(id: number): Promise<void>;
}
