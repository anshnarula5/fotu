import { Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ImageAnalysisService } from "./image-analysis.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller('/v1/image-analysis')
export class ImageAnalysisController {

    constructor(
        @InjectPinoLogger(ImageAnalysisController.name) private readonly logger: PinoLogger,
        private readonly imageAnalysisService: ImageAnalysisService
    ){}

    @Post("/")
    async getImageAnalyiys(
        @Req() req: Request,
        @Res() res: Response) {
            this.logger.info("Got request for image analysis");
            const resposnse = await this.imageAnalysisService.getImageAnalysis();
            return res.status(HttpStatus.OK).send(resposnse)
    }
}