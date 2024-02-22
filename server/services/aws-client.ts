import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dotenv from 'dotenv'
dotenv.config()
//@ts-ignore
const s3Client= new S3Client({
    region:"ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

//@ts-ignore
  export async function getObjectUrl(key){ 
    const command= new GetObjectCommand({
        Bucket: 'blog.dikshak',
        Key: key,
    });

    const url= await getSignedUrl(s3Client, command); 
    return url;
}

//@ts-ignore
 export async function putObject(filename, contentType){
    const command= new PutObjectCommand({
        Bucket: 'blog.dikshak',
        Key: `uploads/profile-pic/${filename}`,
        ContentType: contentType
    })
    const url= await getSignedUrl(s3Client, command);
    return url;
}

async function init(){
    //@ts-ignore
    // console.log('Url for minions', await getObjectUrl(`uploads/profile-pic/image-${global.filename}`));
    //@ts-ignore
    console.log('Url for uploading', await putObject(`image-${global.filename}`, global.contentType));

}

// init();
