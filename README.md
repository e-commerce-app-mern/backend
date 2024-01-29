# BACKEND

## Project initialization

```cmd
npm init -y
npm i -g typescript nodemon
tsc --init
```

## [tsconfig.json](./tsconfig.json) updations

```typescript
"module": "NodeNext",
"moduleResolution": "NodeNext",
"target": "ES2020",
"outDir": "dist",
"rootDir": "src"
```

## [package.json](./package.json) updations

```typescript
"type": "module",
"scripts": {
    // compile and run
    "start": "node dist/app.js",
    // build .js file from corresponding .ts file
    "build": "tsc",
    // monitor changes in .ts and update .js continuously
    "watch": "tsc -w",
    // compile and run .js continuously after changes
    "dev": "nodemon dist/app.js"
  }
```

## Packages

### Depedencies

```cmd
npm i express dotenv mongoose validator multer uuid node-cache morgan stripe cors
```

### Dev dependencies

```cmd
npm i --save-dev typescript nodemon @types/express @types/node @types/validator @types/multer @types/uuid @faker-js/faker @types/morgan @types/cors
```

## Run the following in seperate terminals simultaneously

```cmd
npm run watch
npm run dev
```

## Middlewares

### Read JSON request data

```typescript
app.use(express.json());
```

### Handle [Errors](./src/middlewares/error.ts)

### [Authenticate](./src//middlewares/auth.ts) Users

### Handle File Uploads using [Multer](./src/middlewares/multer.ts)

This enables us to use multipart form data (text or files).

### Upload images as static files

```typescript
app.use(urlname, express.static(pathname));
```

### Receive HTTP requests info in the terminal with [morgan](https://www.npmjs.com/package/morgan)

## Features

- Implemented caching to speed up the data fetching processes by 90%
- Configured route access based on user authentication and authorization

## Deploy on Render

### Build command

```terminal
npm install && mkdir -p uploads && npm run build
```

### Start command

```terminal
node dist/app.js
```

### MongoDB Atlas

- Create a new cluster in the selected project.
- Connect 0.0.0.0 as the IP.
- Create a new user with read/write permission
- Add the mongo_uri to the env file and render's env variable section.
