"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ImageDAO = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3ImageDAO {
    async putImage(filename, imageStringBase64Encoded) {
        let decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");
        const s3Params = {
            Bucket: "tweeter-images-s3bucket",
            Key: "image/" + filename,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: client_s3_1.ObjectCannedACL.public_read,
        };
        const c = new client_s3_1.PutObjectCommand(s3Params);
        const client = new client_s3_1.S3Client({ region: "us-east-1" });
        try {
            await client.send(c);
            return `https://tweeter-images-s3bucket.s3.us-east-1.amazonaws.com/image/${filename}`;
        }
        catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}
exports.S3ImageDAO = S3ImageDAO;
