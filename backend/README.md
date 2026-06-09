# Alima CMS Backend Architecture

Alima CMS utilizes a serverless Backend-as-a-Service (BaaS) architecture powered by Google Firebase. This provides high availability, enterprise security, and automatic scaling for institutional campus sites.

## Core Services

### 1. Authentication (Firebase Auth)
- Identity federation with Google OAuth.
- Standard email/password registration and credentials validation.
- Clients run a dynamic authentication guard checking user sessions on page entry.

### 2. Database (Cloud Firestore)
- Document-oriented NoSQL database.
- Structures data into root collections for `users`, `websites`, `pages`, `media`, and `submissions`.
- Configured with granular security rules enforcing that only site owners can access and modify their digital assets.

### 3. File Storage (Firebase Storage)
- Dynamic upload repository for media assets (images, logos, documents).
- Assets are served securely using Firebase CDN storage bucket URLs.
