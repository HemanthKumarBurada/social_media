import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const { fullName, email, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    return { message: 'Account created successfully', userId: user.id };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return { message: 'Login successful', userId: user.id };
  }

  // FORGOT PASSWORD
  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not registered');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await this.prisma.user.update({
      where: { email },
      data: { otp, otpExpiry },
    });

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hemanthburada2003@gmail.com', // Your Gmail
        pass: 'xwsfxboiefibnrag',           // App password
      },
    });

    await transporter.sendMail({
      from: '"my App" <hemanthburada2003@gmail.com>',
      to: email,
      subject: 'OTP for Password Reset',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    return { message: 'OTP sent to email' };
  }

  // RESET PASSWORD
  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp) {
      throw new BadRequestException('Invalid email or OTP');
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }
}