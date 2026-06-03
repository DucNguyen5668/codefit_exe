# Nutricore Deployment Guide

## Recommended deployment architecture

- **Frontend**: Vercel
- **Backend**: Render, Railway, or VPS Node.js service
- **Database**: MongoDB Atlas
- **Auth**: Firebase Google Auth + app JWT
- **Uploads**: For production, use persistent disk or cloud storage. Local `backend/uploads` may be lost on free hosting restarts.

## Frontend deployment

### Build command

```powershell
npm run build
```

### Required environment variables

Set these in Vercel/hosting dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAJ2mZT1F0D-49AYIHdAnR8iYOVn7fp2vs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nutricore-52d7e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nutricore-52d7e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nutricore-52d7e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=983105464481
NEXT_PUBLIC_FIREBASE_APP_ID=1:983105464481:web:7e0273b844fef8155ae8e0
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Q9RZXFD4D5
```

> [!IMPORTANT]
> Sau khi có domain frontend production, vào Firebase Console → Authentication → Settings → Authorized domains và thêm domain đó.

## Backend deployment

### Start command

```powershell
npm start
```

### Required environment variables

Set these in Render/Railway/VPS environment settings:

```env
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
APP_BASE_URL=https://your-frontend-domain.com
MONGO_URI=your_mongodb_uri
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password_or_app_password
MAIL_FROM="Nutricore Tây Nguyên <no-reply@nutricore.vn>"
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key
```

### Firebase Admin variables

Required for Google login backend verification:

```env
FIREBASE_PROJECT_ID=nutricore-52d7e
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nutricore-52d7e.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

How to get them:

1. Firebase Console → Project settings.
2. Service accounts.
3. Generate new private key.
4. Open downloaded JSON.
5. Map:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

> [!WARNING]
> Do not commit the Firebase service account JSON or private key to GitHub.

## Local development

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Backend

```powershell
cd backend
npm install
npm run dev
```

## Verification after deploy

- Visit frontend domain.
- Check products load from production backend.
- Login with email/password.
- Click Google login.
- Firebase popup opens.
- Backend verifies ID token and creates/updates user.
- Admin account redirects to `/admin`.
- Customer account redirects to regular site.

## Notes about uploads

Current admin product image upload writes to backend local uploads. On Render/Railway free tiers, local files may not persist forever.

Recommended future upgrade:

- Firebase Storage
- Cloudinary
- S3/R2
- Render persistent disk
