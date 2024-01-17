import multer from "multer";
//* Make storage in ROM
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    },
});
//* Store uploaded photo in disk as a file
export const singleUpload = multer({ storage }).single("photo");
