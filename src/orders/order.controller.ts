import {
  Post,
  UseGuards,
  Req,
  Body,
  Inject,
  Controller,
  Get,
  Query,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { Throttle } from '@nestjs/throttler';
import { CreateNewsDto } from './dto/create-news.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { LiquidateOrderDto } from './dto/liquidate-orders.dto';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { UpdateStatusDto } from './dto/update-order-status.dto';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { QueryReportDto } from 'src/commons/dto/query-report.dto';
import { LoadDashboardDataDto } from './dto/load-dashboard-data.dto';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { GenerateReportPdfDto } from './dto/generate-report-pdf.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-order')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    createOrderDto.parent_id = req.user.parent || req.user.id;

    createOrderDto.user_request_id = req.user.id;

    try {
      const order = await firstValueFrom(
        this.client.send('create-order', createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.code,
        error: error.name,
      });
    }
  }

  @Get()
  @Scopes('list-order')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async findAll(@Req() req, @Query() queryParams: QueryParamDto) {
    const { user } = req;

    queryParams.parent_id = user.parent || user.id;
    queryParams.type_user = user.type;

    if (user.type !== 'admin') {
      queryParams.main_user_id = user.id;
    }

    try {
      const orders = await firstValueFrom(
        this.client.send('list-order', queryParams),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Delete(':id')
  @Scopes('delete-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async delete(@Req() req, @Param('id') id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('remove-order', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async update(@Req() req, @Param('id') id: string, @Body() updateOrderDto) {
    updateOrderDto.id = id;
    updateOrderDto.parent_id = req.user.parent || req.user.id;

    updateOrderDto.user_request_id = req.user.id;

    try {
      const order = await firstValueFrom(
        this.client.send('update-order', updateOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':reference/status')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async updateStatus(@Req() req, @Body() updateOrderDto: UpdateStatusDto) {
    updateOrderDto.parent_id = req.user.parent || req.user.id;
    updateOrderDto.user_request_id = req.user.id;

    try {
      const order = await firstValueFrom(
        this.client.send('update-status-order', updateOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('news')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createNews(
    @Req() req,
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: any,
  ) {
    createNewsDto.parent_id = req.user.parent || req.user.id;
    createNewsDto.user_request_id = req.user.id;
    if (file) {
      createNewsDto.file = {
        filename: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer.toString('base64'),
      };
    }
    try {
      const order = await firstValueFrom(
        this.client.send('create-order-news', createNewsDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('payment')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createPayment(
    @Req() req,
    @Body() paymentDto: CreatePaymentDto,
    @UploadedFile() file: any,
  ) {
    paymentDto.parent_id = req.user.parent || req.user.id;
    paymentDto.user_request_id = req.user.id;
    if (file) {
      paymentDto.file = {
        filename: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer.toString('base64'),
      };
    }
    try {
      const order = await firstValueFrom(
        this.client.send('create-order-payment', paymentDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('dashboard/data')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async loadDashboardData(
    @Req() req,
    @Query() queryParams: LoadDashboardDataDto,
  ) {
    try {
      const { user } = req;

      queryParams.parent_id = user.parent || user.id;

      queryParams.type_user = user.type;

      if (user.type !== 'admin') {
        queryParams.main_user_id = user.id;
      }

      const dashboardData = await firstValueFrom(
        this.client.send('load-dashboard-data', queryParams),
      );
      return dashboardData;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('liquidate/money')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async liquidateOrders(
    @Req() req,
    @Body() liquidateOrderDto: LiquidateOrderDto,
  ) {
    try {
      const { user } = req;

      liquidateOrderDto.parent_id = user.parent || user.id;

      const orders = await firstValueFrom(
        this.client.send('liquidate-order', liquidateOrderDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('report/diary')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async diaryReport(@Req() req, @Query() queryReportDto: QueryReportDto) {
    queryReportDto.parent_id = req.user.parent || req.user.id;

    try {
      const orderDiaryReport = await firstValueFrom(
        this.client.send('order-diary-report', queryReportDto),
      );
      return orderDiaryReport;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.code,
        error: error.name,
      });
    }
  }

  @Get('report/performance')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: false, forbidNonWhitelisted: false }))
  async performanceReport(@Req() req, @Query() queryParams: any) {
    try {
      const parent_id = req.user.parent || req.user.id;
      
      // Construir el objeto con los parámetros transformados
      const performanceReportDto: any = {
        parent_id,
      };
      
      if (queryParams.from) {
        performanceReportDto.from = queryParams.from;
      }
      
      if (queryParams.to) {
        performanceReportDto.to = queryParams.to;
      }
      
      if (queryParams.courier) {
        performanceReportDto.courier = queryParams.courier;
      }
      
      const result = await firstValueFrom(
        this.client.send('performance-report', performanceReportDto),
      );
      return result;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.code,
        error: error.name,
      });
    }
  }

  @Get('report/liquidation')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async reportLiquidation(@Req() req, @Query() queryReportDto: QueryReportDto) {
    try {
      queryReportDto.parent_id = req.user.parent || req.user.id;

      const orderLiquidationReport = await firstValueFrom(
        this.client.send('order-liquidation-report', queryReportDto),
      );
      return orderLiquidationReport;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.code,
        error: error.name,
      });
    }
  }

  @Post('report/generate-pdf')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async generateReportPdf(@Req() req, @Body() generateReportPdfDto: GenerateReportPdfDto) {
    try {
      const parent_id = req.user.parent || req.user.id;
      const user_request_id = req.user.id;

      const result = await firstValueFrom(
        this.client.send('generate-report-pdf', {
          ...generateReportPdfDto,
          parent_id,
          user_request_id,
        }),
      );
      return result;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.code,
        error: error.name,
      });
    }
  }

  @Get(':id')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async findOne(@Req() req, @Param('id') id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('find-order', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
