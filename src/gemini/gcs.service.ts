import { Injectable, BadRequestException, Scope } from '@nestjs/common'
import { Storage, UploadResponse } from '@google-cloud/storage'
import * as path from 'path'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class GCSService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        @InjectPinoLogger(GCSService.name) private readonly logger: PinoLogger
    ) {
        this.storage = new Storage();
        this.logger.info(`GCSService instance created`);
    }


    async generateV4ReadSignedUrl(bucketName: string, filename: string): Promise<string> {
        const [url] = await this.storage.bucket(bucketName).file(filename)
            .getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000,
            });

        return url;
    }

    // async uploadFile(localFilePath: string, destinationFileName: string): Promise<string> {
    //     try {
    //         // Upload the file
    //         const uploadedResource: UploadResponse = await this.storage.bucket(this.bucketName).upload(localFilePath, {
    //             destination: destinationFileName,
    //             // gzip: true, // Optional: Gzip the file for better performance
    //             metadata: {
    //                 // cacheControl: 'public, max-age=31536000', // Optional: Cache control
    //             },
    //         })
    //         this.logger.info(`${localFilePath} uploaded to ${this.bucketName}/${destinationFileName}`);
    //         const resourceReadUrl = await this.generateV4ReadSignedUrl(destinationFileName)
    //         this.logger.info(`${localFilePath} uploaded resource details : ${resourceReadUrl}`);
    //         return resourceReadUrl
    //     } catch (error) {
    //         this.logger.error('Error uploading file:', error);
    //         return null
    //     }
    // }

    // async uploadBufferFile(buffer: any, destinationFileName: string): Promise<string> {
    //     try {
    //         const file = this.storage.bucket(this.bucketName).file(destinationFileName)
    //         await file.save(buffer, {
    //             contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //             resumable: false, // Optional: Disable resumable upload for smaller files
    //         })

    //         this.logger.info(`New file has been uploaded to ${this.bucketName}/${destinationFileName}`);
    //         const resourceReadUrl = await this.generateV4ReadSignedUrl(destinationFileName)
    //         this.logger.info(`Uploaded resource signed url : ${resourceReadUrl}`);
    //         return resourceReadUrl
    //     } catch (error) {
    //         this.logger.error(`Error uploading buffer file: ${error?.message} and error object : ${JSON.stringify(error)}`);
    //         return null
    //     }
    // }
}
