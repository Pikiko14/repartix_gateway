import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Inject,
  Req,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { UpdateUserBrandDto } from './dto/update-user-brand.dto';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { UpdateUserCredentialDto } from './dto/update-user-credential.dto';
import { UserBrandConfigurationDto } from './dto/update-user-brand-configuration.dto';

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

  @Get()
  @Scopes('list-user')
  @UseGuards(AuthGuard, ScopesGuard)
  async get(@Req() req, @Query() queryParams: QueryParamDto) {
    queryParams.parent_id = req.user.parent || req.user.id;
    // list user
    try {
      const users = await firstValueFrom(
        this.client.send('list-users', queryParams),
      );
      return users;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id')
  @Scopes('update-user')
  @UseGuards(AuthGuard, ScopesGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    updateUserDto.parent_id = req.user.parent || req.user.id;
    updateUserDto.id = id;

    // list user
    try {
      const user = await firstValueFrom(
        this.client.send('update-users', updateUserDto),
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

  @Put('update-profile')
  @Scopes('update-user')
  @UseGuards(AuthGuard, ScopesGuard)
  async updateProfile(
    @Req() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    try {
      updateUserProfileDto.user_id = req.user.id;
      const user = await firstValueFrom(
        this.client.send('updateUserProfile', updateUserProfileDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('update-brand')
  @Scopes('update-brand')
  @UseGuards(AuthGuard, ScopesGuard)
  async updateBrand(
    @Req() req,
    @Body() updateUserBrand: UpdateUserBrandDto,
  ) {
    try {
      updateUserBrand.user_id = req.user.parent || req.user.id;
      const user = await firstValueFrom(
        this.client.send('updateUserBrand', updateUserBrand),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('update-brand-configuration')
  @Scopes('update-brand')
  @UseGuards(AuthGuard, ScopesGuard)
  async updateBrandConfiguration(
    @Req() req,
    @Body() userBrandConfiguration: UserBrandConfigurationDto,
  ) {
    try {
      userBrandConfiguration.user_id = req.user.parent || req.user.id;
      const user = await firstValueFrom(
        this.client.send('updateUserBrandConfiguration', userBrandConfiguration),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
