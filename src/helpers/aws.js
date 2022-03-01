import S3 from 'aws-sdk/clients/s3.js';
import path from 'path';
import { AWS } from '../config/constants.js';
import fs from 'fs';

const s3 = new S3({
    signatureVersion: 'v4',
    region: AWS.BUCKET_REGION,
    accessKeyId: AWS.ACCESS_KEY_ID,
    secretAccessKey: AWS.ACCESS_SECRET_KEY
})

const s3Upload = (file) => {
    return new Promise((resolve, reject) => {    
        const params = {
            Bucket: AWS.BUCKET_NAME,
            Body: file.buffer,
            Key: Date.now() + path.extname(file.originalname)
        }

        s3.upload(params, (err, result) => {
            if(err) reject(err)


            var config = {Bucket: AWS.BUCKET_NAME, Key: result.Key};
            var promise = s3.getSignedUrlPromise('getObject', config);
            promise.then(url => resolve(url))
        })
    })
}

const downloadObject = (key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Key: key,
            Bucket: AWS.BUCKET_NAME
        }

        resolve(s3.getObject(params, (err) => {
            if(err) reject(err)
        }).createReadStream())
    })
}

export {
    s3Upload,
    downloadObject
}