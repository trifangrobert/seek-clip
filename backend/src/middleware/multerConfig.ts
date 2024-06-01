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
        // checkFileType(file, cb, /mp4|avi|mov|mkv/);
        checkFileType(file, cb, /mp4|avi|mov|mkv|video\/mp4|video\/x-msvideo|video\/quicktime|video\/x-matroska/);
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
    console.log("extname: ", extname);
    console.log("mimetype: ", mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else if (!extname) {
        cb(new Error(`Error extname: Only ${filetypes.toString()} files are allowed! Found: ${path.extname(file.originalname).toLowerCase()}`));
    } else if (!mimetype) {
        cb(new Error(`Error mimetype: Only ${filetypes.toString()} files are allowed! Found: ${file.mimetype}`));
    }
}

export { videoUpload, imageUpload };