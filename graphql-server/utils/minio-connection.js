const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: "172.19.0.3",
  port: 9000,
  accessKey: "minio",
  secretKey: "miniominio",
  useSSL: false,
  
});

module.exports = {

   uploadFile: async function(stream, file_name, bucket_name ){
    try{
        await minioClient.putObject(bucket_name, file_name, stream);
        const url = await minioClient.presignedGetObject(bucket_name, file_name);
        const fileSize = (await minioClient.statObject(bucket_name, file_name)).size;
        console.log("SUCCESS UPLOADING ", url);
        return{
            success: true,
            fileSize,
            url
        }

    }catch(error){
        console.log("ERROR UPLOADING", error); 
        return {
            success: false,
            error: error
        }
    }
   },

   fileExists: async function(file_name, bucket_name){
    try{
        const result = await minioClient.statObject(bucket_name, file_name);
        if(result) return true;

        console.log("RESULT: ", result);
    }catch(error){
        if(error.code && error.code === 'NotFound'){
            console.log("ITEM NOT FOUND")
            return false;
        }else{
            throw error;
        }
    } 

   },

   deleteFile: async function(file_name, bucket_name){
       try{
         await minioClient.removeObject(bucket_name, file_name);
         console.log("OBJECT REMOVED: ", file_name);
         return {
             success: true
         }
       }catch(error){
           return {
               success: false,
               error: error
           }
       }

   },
   minioClient
}