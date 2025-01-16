import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { VertexAI } from '@google-cloud/vertexai';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { imageAnalysisPrompt } from './gemini.prompts';
import { GCSService } from './gcs.service';

@Injectable()
export class GeminiService {
    private readonly projectId: string;
    private readonly location: string;

    constructor(
        @InjectPinoLogger(GeminiService.name) private readonly logger: PinoLogger,
        private readonly gcsService: GCSService
    ) {
        this.projectId = process.env.GCP_PROJECT_ID || 'circular-signal-447313-m4';
        this.location = process.env.GCP_LOCATION || 'us-central1';
    }

    async analyzeImage(): Promise<any> {
        try {
            // Initialize VertexAI client
            const vertexAI = new VertexAI({
                project: this.projectId,
                location: this.location,
            });

            // Get the generative model
            const generativeModel = vertexAI.getGenerativeModel({
                model: 'gemini-1.5-flash-001',
            });

            const fileSignedUrl = await this.gcsService.generateV4ReadSignedUrl("fotu", "test")
            console.log(fileSignedUrl);

            const filePart = {
                fileData: {
                    fileUri: fileSignedUrl,
                    mimeType: "image/jpeg",
                },
            };

            const textPart = {
                text: imageAnalysisPrompt,
            };

            // Generate content
            const request = {
                contents: [
                    {
                        role: 'user',
                        parts: [textPart, filePart],
                    },
                ],
            };

            console.log(JSON.stringify(request));

            const result = await generativeModel.generateContent(request);

            // Return response
            return result;
        } catch (error) {
            this.logger.error(`Error analyzing image: ${error.message}`, error.stack);
            throw new HttpException(
                'Failed to analyze the image.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
