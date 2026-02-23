import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.productService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Post()
    create(@Body() product: any) {
        return this.productService.create(product);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() product: any) {
        return this.productService.update(+id, product);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(+id);
    }
}
