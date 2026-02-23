"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_service_1 = require("./user/user.service");
const bcrypt = require("bcryptjs");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userService = app.get(user_service_1.UserService);
    const clientSideSalt = '$2a$10$abcdefghijklmnopqrstuv';
    const commonPasswordHash = bcrypt.hashSync('password123', clientSideSalt);
    const adminPasswordHash = bcrypt.hashSync('admin123', clientSideSalt);
    const users = [
        {
            name: 'Test User',
            email: 'test@example.com',
            password: commonPasswordHash,
            phoneNumber: '1234567890',
            gender: 'Other',
            dateOfBirth: new Date('1990-01-01'),
        },
        {
            name: 'Demo User',
            email: 'user@example.com',
            password: commonPasswordHash,
            phoneNumber: '0987654321',
            gender: 'Other',
            dateOfBirth: new Date('1995-05-05'),
        },
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminPasswordHash,
            phoneNumber: '0000000000',
            role: 'admin',
            gender: 'Male',
            dateOfBirth: new Date('1980-01-01'),
        },
    ];
    for (const user of users) {
        const existingUser = await userService.findOneByEmail(user.email);
        if (!existingUser) {
            await userService.register(user);
            console.log(`Seeded user: ${user.email}`);
        }
        else {
            console.log(`User already exists: ${user.email}`);
        }
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map