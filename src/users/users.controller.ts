import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  Req,
  Put,
} from '@nestjs/common';
import { firstValueFrom, Subscription } from 'rxjs';
import { envs } from 'src/configuration';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { UpdateUserCredentialDto } from './dto/update-user-credential.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-user')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createUserDto: CreateUserDto) {
    createUserDto.parent_id = req.user.parent || req.user.id;
    // create user
    try {
      const user = await firstValueFrom(
        this.client.send('createUser', createUserDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('update-credentials')
  @Scopes('update-user')
  @UseGuards(AuthGuard, ScopesGuard)
  async updateCredentials(
    @Req() req,
    @Body() updateDredentialsDto: UpdateUserCredentialDto,
  ) {
    try {
      updateDredentialsDto.user_id = req.user.id;
      const user = await firstValueFrom(
        this.client.send('updateUserCredential', updateDredentialsDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAll() {
    return 2;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 3;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return 4;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 5;
  }
}
