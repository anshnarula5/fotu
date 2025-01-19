import { Controller, FileTypeValidator, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { ImageAnalysisService } from "./image-analysis.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('/v1/image-analysis')
export class ImageAnalysisController {

    constructor(
        @InjectPinoLogger(ImageAnalysisController.name) private readonly logger: PinoLogger,
        private readonly imageAnalysisService: ImageAnalysisService
    ) { }

    @Post("/")
    @UseInterceptors(FileInterceptor('file'))
    async getImageAnalyiys(
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File,
    ) {
        this.logger.info("Got request for image analysis");
        const resposnse = await this.imageAnalysisService.getImageAnalysis(file);
        return res.status(HttpStatus.OK).send(resposnse)
    }
}