import { Module } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { GCSService } from "./gcs.service";

@Module({
    imports: [],
    exports: [GeminiService, GCSService, ],
    providers: [GeminiService, GCSService]
})
export class GCPModule{}