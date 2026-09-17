import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';

import { DATABASE } from '../../database/database.module.js';
import type { Database } from '../../database/database.transaction.js';
import { users } from '../../database/schema/identity/users.js';

import { LoginDto } from './dto/login.dto.js';
import { PasswordService } from './password.service.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordValid = await this.passwordService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      id: user.id,
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      status: user.status,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      employeeCode: user.employeeCode,
      email: user.email,
    });

    return {
      accessToken,
    };
  }

  private async findUserByEmail(email: string) {
    const result = await this.db
      .select({
        id: users.id,
        employeeCode: users.employeeCode,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0];
  }
}