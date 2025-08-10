# Admin User Setup

## Permanent Admin User Created

A permanent admin user has been created in the system with the following credentials:

- **Email**: `dark1devil2025@outlook.com`
- **Password**: `1082034D1d@#`
- **Role**: `ADMIN`
- **Email Verified**: `true`

## Features

### 1. No Email Verification Required
- Admin users can sign in directly without email verification
- The authentication flow bypasses email verification checks for ADMIN role users
- This is implemented in both the NextAuth credentials provider and the SignIn form

### 2. Permanent Access
- The admin user is created with `isEmailVerified: true`
- No verification tokens or expiry dates are set
- The user can always sign in regardless of email verification status

## Technical Implementation

### Files Modified:
1. **`src/lib/auth.ts`** - Updated credentials provider to bypass email verification for ADMIN users
2. **`src/components/auth/SignInForm.tsx`** - Updated sign-in form to skip verification check for ADMIN users  
3. **`src/app/api/auth/check-user/route.ts`** - Updated to return user role information

### Scripts Created:
1. **`scripts/create-admin.js`** - Script to create/update the permanent admin user
2. **`scripts/test-admin-login.js`** - Script to test admin login functionality

## Usage

### Sign In as Admin
1. Go to `/auth/signin`
2. Enter email: `dark1devil2025@outlook.com`
3. Enter password: `1082034D1d@#`
4. Click "Sign in"
5. You will be signed in directly without any verification code prompts

### Re-create Admin User
If you need to recreate the admin user, run:
```bash
node scripts/create-admin.js
```

### Test Admin Login
To verify the admin login functionality:
```bash
node scripts/test-admin-login.js
```

## Security Notes

- The admin user has full ADMIN privileges
- The password is strong and includes special characters
- Email verification bypass only applies to users with ADMIN role
- Regular users still require email verification before signing in

## Troubleshooting

If the admin cannot sign in:
1. Run the test script to verify the user exists: `node scripts/test-admin-login.js`
2. Check if the database is properly connected
3. Ensure the Prisma client is generated: `npx prisma generate`
4. Verify the database schema is up to date: `npx prisma db push`

## Database Schema

The admin user is stored in the `User` table with these key fields:
- `role: "ADMIN"`
- `isEmailVerified: true`
- `emailVerificationToken: null`
- `emailVerificationExpires: null`
