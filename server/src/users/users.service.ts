import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(@Body() createUserDto: CreateUserDto) {
    const plainPassword = createUserDto.password;
    const salt = await genSalt();
    createUserDto.password = await hash(plainPassword, salt);
    return await this.usersRepository.save(createUserDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email: email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const plainPassword = updateUserDto.password;
      const salt = await genSalt();
      updateUserDto.password = await hash(plainPassword, salt);
    }
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
