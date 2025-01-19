import { Injectable, BadRequestException, Scope, HttpException, HttpStatus } from '@nestjs/common'
import { Storage, UploadResponse } from '@google-cloud/storage'
import * as path from 'path'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class GCSService {
    private readonly storage: Storage;
    private readonly bucketName: string;
    constructor(
        @InjectPinoLogger(GCSService.name) private readonly logger: PinoLogger
    ) {
        this.storage = new Storage();
        this.bucketName = "fotu";
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

    async listBuckets() {
      try {
        const [buckets] = await this.storage.getBuckets();
        console.log('Buckets:');
        buckets.forEach((bucket) => console.log(bucket.name));
      } catch (error) {
        console.error('Error listing buckets:', error.message);
      }
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
      return new Promise((resolve, reject) => {
        const { originalname, buffer } = file;
        this.logger.info("Uploading image to bucket");
        const bucket = this.storage.bucket('fotu')
        const blob = bucket.file(originalname.replace(/ /g, '_'));
  
        // Create a writable stream to upload the file
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
  
        blobStream
          .on('finish', () => {
            // Construct the GCS URI (gs://bucket-name/file-name)
            const gcsUri = `gs://${bucket.name}/${blob.name}`;
            this.logger.info(`GCS URI: ${gcsUri}`);

            resolve(gcsUri); // Resolve with the GCS URI
          })
          .on('error', (err) => {
            this.logger.info(`Error uploading image to bucket : ${JSON.stringify(err)}`);
            reject(`Unable to upload image: ${err.message}`);
          })
          .end(buffer); // Write the file buffer and end the stream
      });
    }

    

    // async uploadFile(localFilePath: string, destinationFileName: string): Promise<string> {
    //     try {
    //         // Upload the file
    //         const uploadedResource: UploadResponse = await this.storage.bucket(this.bucketName).upload(localFilePath, {
    //             destination: destinationFileName,
    //             metadata: {
    //             },
    //         })
    //         this.logger.info(`${localFilePath} uploaded to ${this.bucketName}/${destinationFileName}`);
    //         const resourceReadUrl = await this.generateV4ReadSignedUrl("fotu", destinationFileName)
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
