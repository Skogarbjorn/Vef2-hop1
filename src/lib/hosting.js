import util from 'util'
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const uploadAsync = util.promisify(cloudinary.uploader.upload);

export async function uploadImage(filepath) {
    return uploadAsync(filepath);
}