# Juat R & D

![image](https://github.com/user-attachments/assets/a1c2a4e5-6c11-44b2-8544-d4bb8a3c0979)

# Find & share great study location while coworking

### Why

"is there anyone coworking this week?"

"does anyone know a good place to study?"

Your answer might be a long silence like mine...

I want to make it easier to find a place to study and cowork with others.!

### Name

is a combination of "Just" and "chat" and "R&D" is "Research & Development".

### Tech Stack mind

- Built with `Qwik` `drizzle` `qwik-ui` `modular-form-qwik`
- Deployed on `Vercel`

## Local Development

To run the project locally:

1. Create a `.env` file with the following variables:

```
AUTH_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_GEO=""
```

2.  Run the development server: \
    using the local database

```
pnpm run dev
```

3.  Run with live data

```
pnpm run dev
```

## Deployment

To deploy to production:

1. Set the following environment variables:

```
PRIVATE_TURSO_DATABASE_URL=""
PRIVATE_TURSO_AUTH_TOKEN=""
```

2. Build the project:

```
pnpm run build
# npx vercel current deployement strategy
```

Note: The current deployment strategy utilizes the Vercel adapter.
