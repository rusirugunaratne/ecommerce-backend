## Setup the project

```
npm install -y
npm i typescript --save-dev (we only need this as dev as we use js in prod)
npx tsc --init
npm i @types/node --save-dev (this is to add type safety)
npm i express
npm i @types/express --save-dev
npm i ts-node nodemon --save-dev (allows you to run TypeScript code directly in Node. js without the need to compile it first)
```

## Prisma

```
npm i prisma @prisma/client
npx prisma init
create the schemas and then run
npx prisma migrate dev --name CreateUserTable
npx prisma studio (for editing and viewing data)
```
