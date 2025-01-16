import { Module } from '@nestjs/common';
import { ImageAnalysisModule } from './image-analysis/image-analysis.module';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from './config/logger.config';

require('dotenv').config();
@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ImageAnalysisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
