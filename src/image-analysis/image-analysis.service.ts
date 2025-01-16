import { Controller, Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { GeminiService } from "src/gemini/gemini.service";

@Injectable()
export class ImageAnalysisService{
    constructor(
        @InjectPinoLogger(ImageAnalysisService.name) private readonly logger: PinoLogger,
        private readonly geminiService: GeminiService
    ){};

    async getImageAnalysis(){
        try{
            this.logger.info("Analysing image: ")
           const response = await this.geminiService.analyzeImage();
           return response;
        } catch(error){
            this.logger.info("Failed to analyze image: ", JSON.stringify(error));
            throw error;
        }
    }
}