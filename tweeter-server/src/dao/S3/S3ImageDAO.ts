import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageDAO } from "../DAO";

export class S3ImageDAO implements ImageDAO {
	async putImage(filename: string, imageStringBase64Encoded: string): Promise<string> {
		let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64Encoded, "base64");
		const s3Params = {
			Bucket: "tweeter-images-s3bucket",
			Key: "image/" + filename,
			Body: decodedImageBuffer,
			ContentType: "image/png",
			ACL: ObjectCannedACL.public_read,
		};
		const c = new PutObjectCommand(s3Params);
		const client = new S3Client({ region: "us-east-1" });
		try {
			await client.send(c);
			return `https://tweeter-images-s3bucket.s3.us-east-1.amazonaws.com/image/${filename}`;
		} catch (error) {
			throw Error("s3 put image failed with: " + error);
		}
	}
}
