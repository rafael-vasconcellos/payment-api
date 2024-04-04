import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [HttpModule, ConfigModule.forRoot({
    envFilePath: '.env'
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
