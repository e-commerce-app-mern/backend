# BACKEND

## Project initialization

```
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

```
npm i express dotenv mongoose validator
```

### Dev dependencies

```
npm i --save-dev @types/express @types/node @types/validator typescript nodemon
```

## Run the following in seperate terminals simultaneously

```
npm run watch
npm run dev
```

## Middlewares

### Read JSON request data

```typescript
app.use(express.json());
```
