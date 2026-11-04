# Task Manager Frontend

GOV.UK-styled frontend for the Task Manager API. Caseworkers can create tasks, view them, update their status and delete them.

## Running locally

Start the backend first, as described in its README.

```
yarn install
yarn build
yarn start:dev
```

Runs on `https://localhost:3100`. The local certificate is self-signed, so your browser will warn you.

Set `BACKEND_URL` to point at something other than `http://localhost:4000`.

## Tests and checks

```
yarn cichecks
```

Install, build, lint and tests — the same command CI runs. The route tests use supertest with axios mocked, so they run without the backend:

```
yarn test:routes
```

## Changes to the starter

Yarn is on the `node-modules` linker because the Nunjucks watcher couldn't resolve `chokidar` under PnP — the CI workflow has a matching install step. The Express error handler was also missing its fourth `next` parameter, so errors were being swallowed.

## Notes

I used AI as a learning aid while building this, mainly for debugging and GOV.UK component syntax. All code was written and reviewed by me.
