import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/"); // ensure the folder exists
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /mp4|avi|mov|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error("Error: Videos only!"));
    }
}

export default upload;