import S3 from 'aws-sdk/clients/s3.js';
import { AWS } from '../config/constants.js';
import fs from 'fs';

const s3 = new S3({
    region: AWS.BUCKET_REGION,
    accessKeyId: AWS.ACCESS_KEY_ID,
    secretAccessKey: AWS.ACCESS_SECRET_KEY
})

const s3Upload = (file) => {
    return new Promise((resolve) => {
        const fileStream = fs.createReadStream(file.path);
    
        const params = {
            Bucket: AWS.BUCKET_NAME,
            Body: fileStream,
            Key: file.filename
        }

        s3.upload(params, (err, result) => {
            if(err) throw err

            resolve(result)
        })
    })
}

const downloadObject = (key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Key: key,
            Bucket: AWS.BUCKET_NAME
        }

        resolve(s3.getObject(params).createReadStream())
    })
}

export {
    s3Upload,
    downloadObject
}