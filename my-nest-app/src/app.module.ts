import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Makes config available across all modules without re-importing
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AppModule {}