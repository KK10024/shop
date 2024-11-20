import { IsOptional } from "class-validator";

export class UpdateDeliveryAddressDto{
    @IsOptional()
    recipientName?: string;
    @IsOptional()
    phone?: string;
    @IsOptional()
    address?: string; 
    @IsOptional()
    isDefault?: boolean;
    @IsOptional()
    userId: string;
}