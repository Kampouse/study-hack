# Juat R & D

![image](https://github.com/user-attachments/assets/a1c2a4e5-6c11-44b2-8544-d4bb8a3c0979)

# Find & share great study location while coworking

### Why

"is there anyone coworking this week?"

"does anyone know a good place to study?"

Your answer might be a long silence like mine...

I want to make it easier to find a place to study and cowork with others.!

### Name

is a combination of "Just" and "chat" and "R&D" is "Reach & Discover".

### Tech Stack mind

- Built with `Qwik` `drizzle` `qwik-ui` `modular-form-qwik`
- Deployed on `Railway & Docker`

## Local Development

To run the project locally:

1. Create a `.env` file with the following variables:

```
# Authentication
AUTH_SECRET="your-auth-secret-here"
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# Google API
GOOGLE_GEO="your-google-geocoding-api-key"

# Database (local development)
DATABASE_URL="file:local.db"

# For local testing with Turso
TURSO_DATABASE_URL="libsql://your-database-url"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

2.  Run the development server with local database:

```
bun run dev
```

3.  Initialize the database (runs automatically with dev):

```
bun run dev:db
bun drizzle/seed.ts
```

## Deployment

To deploy to production:

1. Set the following environment variables in your Vercel project:

```
AUTH_SECRET="your-auth-secret-here"
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
GOOGLE_GEO="your-google-geocoding-api-key"
PRIVATE_TURSO_DATABASE_URL="libsql://your-production-database-url"
PRIVATE_TURSO_AUTH_TOKEN="your-production-turso-auth-token"
```

2. Build the project:

```
bun run build
will type check  and build the app
```

Note: The current deployment strategy utilizes the Vercel adapter.

node server/entry.express
```

Then visit [http://localhost:8080/](http://localhost:8080/)
