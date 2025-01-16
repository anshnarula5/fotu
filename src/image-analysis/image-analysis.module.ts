import { Module } from "@nestjs/common";
import { ImageAnalysisController } from "./image-analysis.controller";
import { ImageAnalysisService } from "./image-analysis.service";
import { GeminiModule } from "src/gemini/gemini.module";

@Module({
    imports: [GeminiModule],
    controllers: [ImageAnalysisController],
    exports: [],
    providers: [ImageAnalysisService]
})
export class ImageAnalysisModule{}