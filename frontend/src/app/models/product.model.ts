export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    rating: number;
    brand?: string;
    color?: string;
    fullDescription?: string;
    specifications?: { [key: string]: string };
    discount?: number;
}
