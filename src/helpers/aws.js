import S3 from 'aws-sdk/clients/s3.js';
import CloudFront from 'aws-sdk/clients/cloudfront.js';
import path from 'path';
import { AWS } from '../config/constants.js';
import url from 'url'

const signer = new CloudFront.Signer(AWS.CLOUDFRONT_ACCESS_KEY_ID, AWS.CLOUDFRONT_PRIVATE_KEY); 

const s3 = new S3({
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
            resolve(signer.getSignedUrl({
                url: url.format(`https://${AWS.CLOUDFRONT_PATH}/${config.Bucket}/${encodeURI(config.Key)}`),
                expires: Math.floor(new Date().getTime() / 1000) + 60 * 60
            }))
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