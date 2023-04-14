import { IsDefined, IsString } from 'class-validator';

export class RefreshDto {
  @IsDefined()
  @IsString()
  token: string;
}
