const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { successResponse, errorResponse } = require('../utils/response');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

async function upload(req, res) {
	try {
		// Accept either { url } or { base64, filename }
		const { url, base64, filename } = req.body;
		if (!url && !base64) return errorResponse(res, 'Either url or base64 data is required', 400);

		let fileName = filename || `img_${Date.now()}.jpg`;
		const filePath = path.join(UPLOAD_DIR, fileName);

		if (url) {
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			fs.writeFileSync(filePath, response.data);
		} else {
			// base64 data like data:image/png;base64,....
			const matches = base64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
			let data = base64;
			if (matches) data = matches[2];
			const buffer = Buffer.from(data, 'base64');
			fs.writeFileSync(filePath, buffer);
		}

	const publicUrl = `/uploads/${fileName}`; // consumer can serve this statically
	return successResponse(res, 'File uploaded successfully', { url: publicUrl }, 201);
	} catch (error) {
		console.error('Upload error:', error);
		return errorResponse(res, 'Failed to upload file', 500);
	}
}

module.exports = { upload };
