import { Controller, Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { GCSService } from "src/gcp/gcs.service";
import { GeminiService } from "src/gcp/gemini.service";

@Injectable()
export class ImageAnalysisService{
    constructor(
        @InjectPinoLogger(ImageAnalysisService.name) private readonly logger: PinoLogger,
        private readonly geminiService: GeminiService,
        private readonly gcsService: GCSService
    ){};

    async getImageAnalysis(file: Express.Multer.File){
        try{
            const gcsUri = await this.gcsService.uploadImage(file);
           const response = await this.geminiService.analyzeImage(gcsUri);
           return response;
        } catch(error){
            this.logger.info("Failed to analyze image: ", JSON.stringify(error));
            throw error;
        }
    }
}