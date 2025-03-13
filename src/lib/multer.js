import multer from 'multer';

const DIR = process.env.MULTER_TEMP_DIR;

export function withMulter(req, res, next) {
    multer({ dest: DIR }).single('image')(req, res, (err) => {
        if (err) {
            if (err.message === 'Unexpected field') {
                const errors = [
                    {
                        field: 'image',
                        error: 'Unable to read image'
                    }
                ];
                return res.status(400).json({ errors });
            }

            return next(err);
        }

        return next();
    })
}