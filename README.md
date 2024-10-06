# Study & Hack

Find your ideal study partner and coworking space in your city
.

### Features

- Connect with like-minded people and more!~
- Discover convenient coworking spaces
- some other marketing thing i dont know yet

### Tech Stack

- Built with `Qwik` `drizzle` `qwik-ui`
- Deployed on `Vercel`

## Local Development

To run the project locally:

1. Create a `.env` file with the following variables:

```
AUTH_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

2.  Run the development server: \
    using the local database

```
pnpm run dev:local
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
