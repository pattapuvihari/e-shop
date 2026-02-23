import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity/product.entity';

@Injectable()
export class ProductService implements OnModuleInit {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async onModuleInit() {
        await this.seed();
    }

    async seed() {
        const products = await this.productRepository.find();
        if (products.length === 0) {
            const newProducts: Partial<Product>[] = Array.from({ length: 10 }).map((_, i) => ({
                name: `Product ${i + 1}`,
                description: `This is the description for Product ${i + 1}`,
                price: parseFloat((Math.random() * 100).toFixed(2)),
                imageUrl: `https://placehold.co/200?text=Product+${i + 1}`,
                rating: parseFloat((Math.random() * 5).toFixed(1)),
                brand: 'Generic',
                color: 'Black'
            }));
            await this.productRepository.save(newProducts);
            console.log('Seeded 10 products');
        }

        const additionalProducts = [
            {
                name: 'MacBook Pro 16"',
                description: 'Apple M3 Max chip, 36GB Unified Memory, 1TB SSD',
                fullDescription: 'The MacBook Pro 16-inch with M3 Max chip delivers tailored performance for the most demanding workflows. With a stunning Liquid Retina XDR display, up to 22 hours of battery life, and all the ports you need, it is a pro laptop without equal.',
                price: 2499.00,
                imageUrl: '/assets/products/macbook-pro.png',
                rating: 4.8,
                brand: 'Apple',
                color: 'Silver',
                specifications: {
                    'Processor': 'Apple M3 Max',
                    'RAM': '36GB Unified Memory',
                    'Storage': '1TB SSD',
                    'Display': '16.2-inch Liquid Retina XDR',
                    'Battery Life': 'Up to 22 hours',
                    'Weight': '4.8 lbs'
                }
            },
            {
                name: 'Dell XPS 13',
                description: 'Intel Core Ultra 7, 16GB RAM, 512GB SSD, FHD+',
                fullDescription: 'The Dell XPS 13 is designed to be the ultimate mobile laptop. Crafted from machined aluminum and carbon fiber, it features a stunning InfinityEdge display and the latest Intel Core Ultra processors for powerful performance on the go.',
                price: 1299.00,
                imageUrl: '/assets/products/dell-xps.png',
                rating: 4.5,
                brand: 'Dell',
                color: 'Silver',
                specifications: {
                    'Processor': 'Intel Core Ultra 7 155H',
                    'RAM': '16GB LPDDR5x',
                    'Storage': '512GB PCIe Gen 4 SSD',
                    'Display': '13.4" FHD+ InfinityEdge',
                    'OS': 'Windows 11 Home',
                    'Weight': '2.6 lbs'
                }
            },
            {
                name: 'HP Spectre x360',
                description: '2-in-1 Laptop, Intel Core i7, 16GB RAM, 1TB SSD',
                fullDescription: 'Experience the best of both worlds with the HP Spectre x360. This 2-in-1 laptop adapts to your needs with a 360-degree hinge, stunning OLED display, and AI-enhanced features for video calls and security.',
                price: 1599.99,
                imageUrl: '/assets/products/hp-spectre.png',
                rating: 4.6,
                brand: 'HP',
                color: 'Blue',
                specifications: {
                    'Processor': 'Intel Core i7-1355U',
                    'RAM': '16GB LPDDR4x',
                    'Storage': '1TB PCIe Gen4 NVMe TLC M.2 SSD',
                    'Display': '13.5" 3K2K OLED Touch',
                    'Form Factor': 'Convertible 2-in-1',
                    'Audio': 'Bang & Olufsen'
                }
            },
            {
                name: 'iPhone 15 Pro',
                description: 'Titanium design, A17 Pro chip, 48MP Main camera',
                fullDescription: 'iPhone 15 Pro. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.',
                price: 999.00,
                imageUrl: '/assets/products/iphone-15.png',
                rating: 4.9,
                brand: 'Apple',
                color: 'Titanium',
                specifications: {
                    'Processor': 'A17 Pro chip',
                    'Display': '6.1-inch Super Retina XDR',
                    'Camera': '48MP Main | Ultra Wide | Telephoto',
                    'Material': 'Titanium with textured matte glass back',
                    'Connector': 'USB-C',
                    'Face ID': 'Yes'
                }
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'AI-powered, Snapdragon 8 Gen 3, 200MP Camera',
                fullDescription: 'Unleash new levels of creativity, productivity, and possibility with Galaxy S24 Ultra. Powered by Galaxy AI, it features a durable titanium frame, a built-in S Pen, and an epic 200MP camera system.',
                price: 1299.00,
                imageUrl: '/assets/products/samsung-s24.png',
                rating: 4.7,
                brand: 'Samsung',
                color: 'Black',
                specifications: {
                    'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
                    'Display': '6.8" QHD+ Dynamic AMOLED 2X',
                    'Camera': '200MP Wide | 50MP/10MP Telephoto | 12MP Ultra Wide',
                    'Battery': '5000 mAh',
                    'S Pen': 'Integrated',
                    'AI Features': 'Note Assist, Live Translate, Circle to Search'
                }
            },
            {
                name: 'Google Pixel 8 Pro',
                description: 'Google Tensor G3, Advanced AI, Best-in-class camera',
                fullDescription: 'Meet Pixel 8 Pro, the all-pro phone engineered by Google. It has a sleek, polished design, the new Google Tensor G3 chip, and Google AI to help you do more, even faster.',
                price: 999.00,
                imageUrl: '/assets/products/pixel-8.png',
                rating: 4.6,
                brand: 'Google',
                color: 'Blue',
                specifications: {
                    'Processor': 'Google Tensor G3',
                    'Display': '6.7-inch Super Actua display',
                    'Camera': '50MP wide | 48MP ultrawide | 48MP telephoto',
                    'Memory': '12 GB LPDDR5X RAM',
                    'Security': 'Google Tensor security core, Titan M2 chip',
                    'Updates': '7 years of OS, security, and Feature Drop updates'
                }
            }
        ];

        for (const p of additionalProducts) {
            const exists = await this.productRepository.findOneBy({ name: p.name });
            if (!exists) {
                await this.productRepository.save(p);
                console.log(`Seeded ${p.name}`);
            } else {
                // Update existing test products with brand/color/imageURL/description if missing or placeholder
                let changed = false;
                if (!exists.brand || !exists.color) {
                    exists.brand = p.brand;
                    exists.color = p.color;
                    changed = true;
                }
                if (exists.imageUrl.includes('placehold.co')) {
                    exists.imageUrl = p.imageUrl;
                    changed = true;
                }
                if (!exists.fullDescription && p.fullDescription) {
                    exists.fullDescription = p.fullDescription;
                    exists.specifications = p.specifications;
                    changed = true;
                }

                if (changed) {
                    await this.productRepository.save(exists);
                    console.log(`Updated ${p.name}`);
                }
            }
        }

        // Fix existing broken images and add default brand/color
        const allProducts = await this.productRepository.find();
        let updated = false;
        for (const product of allProducts) {
            let changed = false;
            if (product.imageUrl.includes('via.placeholder.com')) {
                product.imageUrl = product.imageUrl.replace('via.placeholder.com', 'placehold.co');
                changed = true;
            }
            if (!product.brand) {
                product.brand = 'Generic';
                changed = true;
            }
            if (!product.color) {
                product.color = 'Black';
                changed = true;
            }

            if (changed) {
                await this.productRepository.save(product);
                updated = true;
            }
        }
        if (updated) console.log('Updated existing products with new data');
    }

    findAll(query: any): Promise<Product[]> {
        const where: any = {};
        if (query.brand) where.brand = query.brand;
        if (query.color) where.color = query.color;
        return this.productRepository.find({ where });
    }

    findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOneBy({ id });
    }

    async create(product: Partial<Product>): Promise<Product> {
        return this.productRepository.save(product);
    }

    async update(id: number, product: Partial<Product>): Promise<Product> {
        await this.productRepository.update(id, product);
        return this.productRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
