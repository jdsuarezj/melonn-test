import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class itemDTO {
  id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  itemName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  itemQTY: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  itemWeight: string;
}

export class createOrderDTO {
  id: string;

  createDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  store: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  @IsNumber()
  shippingMethod: number;

  shippingMethodName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  @IsNumber()
  externalOrder: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  buyerName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  buyerPhone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  // @IsEmail()
  buyerMail: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  shippingAddress: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  shippingCity: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  shippingRegion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required' })
  shippingCountry: string;

  @ApiProperty({ type: [itemDTO] })
  @IsNotEmpty({ message: 'Required' })
  lineItems: itemDTO[];

  packMin: string;

  packMax: string;

  shipMin: string;

  shipMax: string;

  deliveryMin: string;

  deliveryMax: string;

  pickupMin: string;

  pickupMax: string;
}

export class orderDTO {
  id: string;

  createDate: Date;

  store: string;

  shippingMethod: number;

  shippingMethodName: string;

  externalOrder: number;

  buyerName: string;

  buyerPhone: string;

  buyerMail: string;

  shippingAddress: string;

  shippingCity: string;

  shippingRegion: string;

  shippingCountry: string;

  lineItems: itemDTO[];

  packMin: string;

  packMax: string;

  shipMin: string;

  shipMax: string;

  deliveryMin: string;

  deliveryMax: string;

  pickupMin: string;

  pickupMax: string;
}
