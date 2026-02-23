import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(query: any): Promise<import("./entities/product.entity/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity/product.entity").Product>;
    create(product: any): Promise<import("./entities/product.entity/product.entity").Product>;
    update(id: string, product: any): Promise<import("./entities/product.entity/product.entity").Product>;
    remove(id: string): Promise<void>;
}
