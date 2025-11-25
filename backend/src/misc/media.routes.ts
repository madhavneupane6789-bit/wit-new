import { Router } from 'express';
import axios from 'axios';
import { GoogleAuth, JWT } from 'google-auth-library';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

const router = Router();

async function getAccessToken() {
  if (!env.googleServiceEmail || !env.googleServicePrivateKey) {
    throw new AppError(500, 'Google service account not configured');
  }
  const client = new JWT({
    email: env.googleServiceEmail,
    key: env.googleServicePrivateKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const creds = await client.authorize();
  if (!creds || !creds.access_token) throw new AppError(500, 'Unable to obtain Google access token');
  return creds.access_token;
}

router.get('/media/:fileId', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const range = req.headers.range;
    const token = await getAccessToken();
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(range ? { Range: range as string } : {}),
      },
      validateStatus: (status) => status >= 200 && status < 500,
    });

    if (response.status === 404) {
      throw new AppError(404, 'File not found or access denied');
    }

    res.status(response.status);
    Object.entries(response.headers).forEach(([k, v]) => {
      if (v !== undefined) res.setHeader(k, v as any);
    });
    response.data.pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
