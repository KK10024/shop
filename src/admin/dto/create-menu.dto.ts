import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMenuDto {
    @ApiProperty({
        description: '메뉴 항목의 이름',
        example: '메뉴1',
    })
    @IsString()
    name: string;
}