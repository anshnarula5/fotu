import { Module } from "@nestjs/common";
import { ImageAnalysisController } from "./image-analysis.controller";
import { ImageAnalysisService } from "./image-analysis.service";
import { GCPModule } from "src/gcp/gcp.module"

@Module({
    imports: [GCPModule],
    controllers: [ImageAnalysisController],
    exports: [],
    providers: [ImageAnalysisService]
})
export class ImageAnalysisModule{}