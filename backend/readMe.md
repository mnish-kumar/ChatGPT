### Phase 1 (Core — done ✅)
└── register, login, logout, refresh

## Phase 2 (Trust)
├── email verification
└── forgot password

## Phase 3 (Growth)
├── Google OAuth
└── GitHub OAuth

## Phase 4 (Security)
├── 2FA / OTP
└── session management

## Phase 5 (Admin)
└── user management APIs


## 🔐1.  Complete Auth API List (COMPLETE✅)
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token



## 2.  📧 Email Verification (COMPLETE✅)
POST /auth/send-verification-email   → send OTP/link to email
GET  /auth/verify-email/:token       → verify email on click
POST /auth/resend-verification-email → resend if expired
### FLOW -> Register → send email with token → user clicks link → account activated
            Unverified users → blocked from protected routes



## 🔑3.  Forgot Password (COMPLETE✅)
POST /auth/forgot-password           → send reset link to email
POST /auth/verify-reset-token        → validate token is valid/not expired
POST /auth/reset-password            → set new password
### FLOW -> User enters email → get reset link (15min TTL in Redis)
            Click link → verify token → enter new password → all sessions invalidated



## 🌐4.  Social Login (Google / GitHub)
GET  /auth/google                    → redirect to Google OAuth
GET  /auth/google/callback           → Google redirects here
### FLOW -> Click "Login with Google" → Google OAuth screen
            ## → callback with code → exchange for profile
            ## → find or create user → issue accessToken + refreshToken



### 🔒5.   2FA / OTP
POST /auth/2fa/setup                 → generate QR code (Google Authenticator)
POST /auth/2fa/enable                → verify first OTP to activate 2FA
POST /auth/2fa/verify                → verify OTP on login
POST /auth/2fa/disable               → disable 2FA
POST /auth/2fa/recovery              → login with backup code
### FLOW -> Enable → scan QR → enter OTP → 2FA active
Login  → password ✅ → OTP prompt → verify → accessToken issued



## 👤6.  User Management
GET   /auth/me                       → get current user profile
PATCH /auth/me                       → update profile (name, username)
PATCH /auth/me/password              → change password (needs old password)
PATCH /auth/me/avatar                → upload profile picture
DELETE /auth/me                      → delete own account



## 📱7.  Session Management
GET    /auth/sessions                → list all active sessions/devices
DELETE /auth/sessions/:sessionId     → logout specific device
DELETE /auth/sessions                → logout ALL devices



## 👑8.  Admin APIs
GET    /admin/users                  → list all users (paginated)
GET    /admin/user/:id               → get specific user
PATCH  /admin/user/:id/role          → change user role
PATCH  /admin/user/:id/ban           → ban/unban user
DELETE /admin/user/:id               → delete user
GET    /admin/user/:id/sessions      → view user's active sessions
DELETE /admin/user/:id/sessions      → force logout user