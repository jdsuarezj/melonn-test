import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SellService } from '../../services/sell/sell.service';
import { createOrderDTO, orderDTO } from '../../data/order.dto';
import { v4 as uuid } from 'uuid';

@Controller('sell')
export class SellController {
  constructor(private service: SellService) {}

  @ApiOperation({ summary: 'Retrieve the list of off days' })
  @ApiResponse({
    status: 200,
    description: 'List of off days ',
  })
  @ApiResponse({ status: 400, description: 'Error' })
  @Get('off-days')
  public async OffDays(): Promise<JSON> {
    try {
      return await this.service.offDays();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Retrieve the list of available shipping methods' })
  @ApiResponse({
    status: 200,
    description: 'List of available shipping methods ',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: false,
    description: 'Shipping methods by Id',
  })
  @ApiResponse({ status: 400, description: 'Error' })
  @Get('shipping-methods/:id?')
  public async ShippingMethods(@Param('id') id: string) {
    id = id === ',' ? undefined : id;
    try {
      return await this.service.shippingMethods(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Retrieve the list of all orders of the session' })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
  })
  @ApiParam({
    name: 'sessionid',
    type: String,
    description: 'SessionID',
  })
  @ApiResponse({ status: 400, description: 'Error' })
  @Get('session-orders-list/:sessionid')
  public async SessionOrderList(
    @Param('sessionid') sessionid: string,
  ): Promise<orderDTO[]> {
    try {
      return await this.service.sessionOrderList(sessionid);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Order by id' })
  @ApiResponse({
    status: 200,
    description: 'Order',
  })
  @ApiParam({
    name: 'sessionid',
    type: String,
    description: 'SessionID',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Shipping methods by Id',
  })
  @ApiResponse({ status: 400, description: 'Error' })
  @Get('order/:sessionid')
  public async OrderById(
    @Param('sessionid') sessionid: string,
    @Query('id') id: string,
  ): Promise<orderDTO[]> {
    try {
      return await this.service.orderById(sessionid, id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Save order' })
  @ApiParam({
    name: 'sessionid',
    type: String,
    description: 'SessionID',
  })
  @Post('save-order/:sessionid')
  public async SaveOrder(
    @Param('sessionid') sessionid: string,
    @Body() order: createOrderDTO,
  ): Promise<any> {
    //Get data from Shipping method rules and name
    const {
      rules: { availability },
      rules: { promisesParameters },
      name,
    } = await this.service.shippingMethods(order.shippingMethod.toString());

    //Get now datetime and format
    const today = new Date();
    const todayFormat = today.toISOString().split('T')[0];

    //Get info of business days
    const offDays = await this.service.offDays();

    //Determine if today is a business day
    const isBusinessDay = offDays.filter((day) => {
      return day === todayFormat;
    });

    //Array of business days
    let nextBusinessDays = [];
    let maxNextBusinessDays = 0;
    for (let i = 1; maxNextBusinessDays < 10; i++) {
      const newBusinessDay = new Date();
      newBusinessDay.setDate(newBusinessDay.getDate() + i);
      const isBusinessDay = !offDays.includes(
        newBusinessDay.toISOString().split('T')[0],
      );
      if (isBusinessDay)
        nextBusinessDays = nextBusinessDays.concat(newBusinessDay);
      maxNextBusinessDays = nextBusinessDays.length;
    }

    //Get total order weight
    const weightTotal = order.lineItems.reduce((add, item) => {
      return add + parseFloat(item.itemWeight);
    }, 0);

    //Validate weight
    if (
      weightTotal < availability.byWeight.min ||
      weightTotal > availability.byWeight.max
    ) {
      throw new HttpException(
        { message: 'Out of the permitted weight range' },
        HttpStatus.OK,
      );
    }

    //Validate based on request time availability
    if (
      availability.byRequestTime.dayType === 'BUSINESS' &&
      isBusinessDay.length > 0
    ) {
      throw new HttpException(
        {
          message:
            'The order cannot be placed with this shipping method and day',
        },
        HttpStatus.OK,
      );
    }

    //Validate time of day
    if (
      today.getHours() < availability.byRequestTime.fromTimeOfDay ||
      today.getHours() > availability.byRequestTime.toTimeOfDay
    ) {
      throw new HttpException(
        {
          message:
            'The order cannot be placed with this shipping method and time',
        },
        HttpStatus.OK,
      );
    }

    //Get cases from rules
    const listCases = promisesParameters.cases;
    let workingCase = {};
    for (let i = 0; i <= listCases.length; i++) {
      if (!listCases[0]['priority']) {
        throw new HttpException(
          { message: 'This should never happen' },
          HttpStatus.OK,
        );
      }
      //Validate day type
      if (
        availability.byRequestTime.dayType === 'BUSINESS' &&
        isBusinessDay.length > 0
      )
        continue;

      //Validate time of day
      if (
        today.getHours() < availability.byRequestTime.fromTimeOfDay ||
        today.getHours() > availability.byRequestTime.toTimeOfDay
      )
        continue;

      //Set working case
      workingCase = listCases[i];
      break;
    }

    //Get PACK promise params
    const minType = workingCase['packPromise'].min.type;
    const maxType = workingCase['packPromise'].max.type;
    const minDeltaHours = workingCase['packPromise'].min.deltaHours;
    const maxDeltaHours = workingCase['packPromise'].max.deltaHours;
    const minDeltaBusinessDays =
      workingCase['packPromise'].min.deltaBusinessDays;
    const maxDeltaBusinessDays =
      workingCase['packPromise'].max.deltaBusinessDays;
    const minTimeOfDay = workingCase['packPromise'].min.timeOfDay;
    const maxTimeOfDay = workingCase['packPromise'].max.timeOfDay;

    //Calculate PACK promise MIN
    switch (minType) {
      case undefined:
        order.packMin = 'null';
        break;
      case 'DELTA-HOURS':
        order.packMin = new Date(
          today.setHours(today.getHours() + minDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.packMin = new Date(
          nextBusinessDays[minDeltaBusinessDays - 1].setHours(minTimeOfDay),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Calculate PACK promise MAX
    switch (maxType) {
      case undefined:
        order.packMax = 'null';
        break;
      case 'DELTA-HOURS':
        order.packMax = new Date(
          today.setHours(today.getHours() + maxDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.packMax = new Date(
          nextBusinessDays[maxDeltaBusinessDays - 1].setHours(maxTimeOfDay),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Get SHIP promise params
    const minShipType = workingCase['shipPromise'].min.type;
    const maxShipType = workingCase['shipPromise'].max.type;
    const minShipDeltaHours = workingCase['shipPromise'].min.deltaHours;
    const maxShipDeltaHours = workingCase['shipPromise'].max.deltaHours;
    const minShipDeltaBusinessDays =
      workingCase['shipPromise'].min.deltaBusinessDays;
    const maxShipDeltaBusinessDays =
      workingCase['shipPromise'].max.deltaBusinessDays;
    const minShipTimeOfDay = workingCase['shipPromise'].min.timeOfDay;
    const maxShipTimeOfDay = workingCase['shipPromise'].max.timeOfDay;

    //Calculate SHIP promise MIN
    switch (minShipType) {
      case undefined:
        order.shipMin = 'null';
        break;
      case 'DELTA-HOURS':
        order.shipMin = new Date(
          today.setHours(today.getHours() + minShipDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.shipMin = new Date(
          nextBusinessDays[minShipDeltaBusinessDays - 1].setHours(
            minShipTimeOfDay,
          ),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Calculate SHIP promise MAX
    switch (maxShipType) {
      case undefined:
        order.shipMax = 'null';
        break;
      case 'DELTA-HOURS':
        order.shipMax = new Date(
          today.setHours(today.getHours() + maxShipDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.shipMax = new Date(
          nextBusinessDays[maxShipDeltaBusinessDays - 1].setHours(
            maxShipTimeOfDay,
          ),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Get DELIV promise params
    const minDelType = workingCase['deliveryPromise'].min.type;
    const maxDelType = workingCase['deliveryPromise'].max.type;
    const minDelDeltaHours = workingCase['deliveryPromise'].min.deltaHours;
    const maxDelDeltaHours = workingCase['deliveryPromise'].max.deltaHours;
    const minDelDeltaBusinessDays =
      workingCase['deliveryPromise'].min.deltaBusinessDays;
    const maxDelDeltaBusinessDays =
      workingCase['deliveryPromise'].max.deltaBusinessDays;
    const minDelTimeOfDay = workingCase['deliveryPromise'].min.timeOfDay;
    const maxDelTimeOfDay = workingCase['deliveryPromise'].max.timeOfDay;

    //Calculate DELIV promise MIN
    switch (minDelType) {
      case undefined:
        order.deliveryMin = 'null';
        break;
      case 'DELTA-HOURS':
        order.deliveryMin = new Date(
          today.setHours(today.getHours() + minDelDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.deliveryMin = new Date(
          nextBusinessDays[minDelDeltaBusinessDays - 1].setHours(
            minDelTimeOfDay,
          ),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Calculate DELIV promise MAX
    switch (maxDelType) {
      case undefined:
        order.deliveryMax = 'null';
        break;
      case 'DELTA-HOURS':
        order.deliveryMax = new Date(
          today.setHours(today.getHours() + maxDelDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.deliveryMax = new Date(
          nextBusinessDays[maxDelDeltaBusinessDays - 1].setHours(
            maxDelTimeOfDay,
          ),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Get PICK promise params
    const minPickType = workingCase['readyPickUpPromise'].min.type;
    const maxPickType = workingCase['readyPickUpPromise'].max.type;
    const minPickDeltaHours = workingCase['readyPickUpPromise'].min.deltaHours;
    const maxPickDeltaHours = workingCase['readyPickUpPromise'].max.deltaHours;
    const minPickDeltaBusinessDays =
      workingCase['readyPickUpPromise'].min.deltaBusinessDays;
    const maxPickDeltaBusinessDays =
      workingCase['readyPickUpPromise'].max.deltaBusinessDays;
    const minPickTimeOfDay = workingCase['readyPickUpPromise'].min.timeOfDay;
    const maxPickTimeOfDay = workingCase['readyPickUpPromise'].max.timeOfDay;

    //Calculate PICK promise MIN
    switch (minPickType) {
      case undefined:
        order.pickupMin = 'null';
        break;
      case 'DELTA-HOURS':
        order.pickupMin = new Date(
          today.setHours(today.getHours() + minPickDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.pickupMin = new Date(
          nextBusinessDays[minPickDeltaBusinessDays - 1].setHours(
            minPickTimeOfDay,
          ),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Calculate PICK promise MAX
    switch (maxPickType) {
      case undefined:
        order.pickupMax = 'null';
        break;
      case 'DELTA-HOURS':
        order.pickupMax = new Date(
          today.setHours(today.getHours() + maxPickDeltaHours),
        )
          .toUTCString()
          .toString();
        break;
      case 'DELTA-BUSINESSDAYS':
        order.pickupMax = new Date(
          nextBusinessDays[maxPickDeltaBusinessDays - 1].setHours(
            maxPickTimeOfDay,
          ),
        )
          .toUTCString()
          .toString();
        break;
    }

    //Save order with promises calculation in GMT-0
    const data = await this.service.saveOrder(
      {
        id: uuid(),
        createDate: today.toUTCString(),
        shippingMethodName: name,
        ...order,
      },
      sessionid,
    );
    return data;
  }
}
