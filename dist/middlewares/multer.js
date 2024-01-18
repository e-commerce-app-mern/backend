import multer from "multer";
import { v4 as uuid } from "uuid";
//* Make storage in ROM
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`);
    },
});
//* Store uploaded photo in disk as a file
export const singleUpload = multer({ storage }).single("photo");
