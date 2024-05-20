import multer from "multer";
import path from "path";

// Base storage configuration using a function to determine the folder dynamically
function storageConfig(folder: string) {
    return multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, folder);
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        }
    });
}

// Video upload configuration
const videoUpload = multer({
    storage: storageConfig("uploads/"),
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb, /mp4|avi|mov|mkv/);
    }
});

// Image upload configuration
const imageUpload = multer({
    storage: storageConfig("profile-pictures/"),
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb, /jpeg|jpg|png|gif/);
    }
});

// General function to check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback, filetypes: RegExp) {
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    console.log("From multerConfig.ts: ", file);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error(`Error: Only ${filetypes.toString()} files are allowed!`));
    }
}

export { videoUpload, imageUpload };