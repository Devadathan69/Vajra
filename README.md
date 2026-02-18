# Vajra Event Management System

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Firebase**:
    - Create a project in [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Email/Password).
    - Enable **Firestore Database** (Start in Test Mode or Production Mode).
    - Set Firestore Rules:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            allow read, write: if request.auth != null;
          }
        }
      }
      ```
    - Copy your web app configuration.
    - Update `src/firebase.js` with your config keys.
    - Update `scripts/seedDatabase.js` with the SAME config keys.

3.  **Seed Database**:
    - Ensure `Vajra Registration.xlsx` is in the root folder.
    - Run the seeding script:
      ```bash
      node scripts/seedDatabase.js
      ```
    - This will populate the `participants` collection in Firestore.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Features
- **Admin Login**: Secure access via Firebase Auth.
- **QR Scanner**: Scan participant badges.
- **Food Entry**: Manage Breakfast, Lunch, Dinner with duplicate prevention.
- **Stats**: Live count of meals served.
