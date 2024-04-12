//multer.ts

import multer from "multer";
import path from "path";

export default multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, '../uploads/articles/')
        },
        filename: (_req, file, cb) => {
            const ext = file.mimetype.split('/')[1]
            cb(null, `${Date.now()}.${ext}`)
        },
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
});