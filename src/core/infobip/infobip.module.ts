import { Module } from '@nestjs/common';
import { InfobipService } from './infobip.service';

@Module({
  providers: [InfobipService],
  exports: [InfobipService],
})
export class InfobipModule {}
