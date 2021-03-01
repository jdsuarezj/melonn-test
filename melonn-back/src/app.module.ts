import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellController } from './controllers/sell/sell.controller';
import { SellService } from './services/sell/sell.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController, SellController],
  providers: [AppService, SellService],
})
export class AppModule {}
