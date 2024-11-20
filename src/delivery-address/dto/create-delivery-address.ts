import { IsBoolean, IsString } from "class-validator";

export class CreateDeliveryAddressDto{
    @IsString()
    recipientName: string;
    @IsString()
    phone: string;
    @IsString()
    address: string; 
    @IsBoolean()
    isDefault?: boolean
    @IsString()
    userId: string;
}