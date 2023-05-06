# alter-firestore

## Description

This npm package is a CLI that executes TypeScript files to manage Firestore migration or alteration processes within your repository.

![demo-alter-firestore](https://user-images.githubusercontent.com/16274232/235307607-3103ce8c-cf5c-48b0-84ac-9639958ae6df.gif)

## installation

**Please set the 'type' field in your package.json to 'module' since this package supports Pure ESM.**

```json
{
  "type": "module"
}
```

```bash
$ npm i alter-firestore
```

```bash
$ ts-node-esm node_modules/.bin/alfs
# or
$ node --loader ts-node/esm node_modules/.bin/alfs
```

or

```json
{
  "scripts": {
    "alfs": "ts-node-esm node_modules/.bin/alfs"
  }
}
```

then

```bash
$ npm run alfs -- migrate --project staging
$ npm run alfs -- migrate # default project will be emulator
```

### set alfsrc.js

```js
export default {
  emulator: {
    options: {
      projectId: '',
    },
    ports: {
      auth: '', // ex: 9099
      firestore: '', // ex: 8080
      storage: '', // ex: 9199
    },
  },
  credentialPaths: {
    '{this key use for --project option}': '', // ex: staging: './.envs/staging/firebase-admin-sdk.json'
  },
  migration: {
    collectionName: 'migrations', // <-- default
    directoryPath: 'migrations-files', // <-- default ex: firestore/migrations/files
  },
  alter: {
    directoryPath: 'alter-files', // <-- default ex: firestore/alters/files
    aliases: {
      '{key}': ['{filepath}'],
    },
  },
}
```

## Migration File

```ts
import { ActionArg } from 'alter-firestore/types/command'
import { MigrateOptions, RefreshOptions } from 'alter-firestore/types/options'

export const up = async ({ firestore }: ActionArg<MigrateOptions>) => {
  const snapshot = await firestore.getDoc('{path}', '{documentId}')
  if (snapshot.exists) {
    throw Error(`${'{path}'}${'{documentId}'}/${snapshot.id} is already exists`)
  }
  return firestore.create('{path}', '{documentId}', value)
}

export const down = async ({ firestore }: ActionArg<RefreshOptions>) => {
  const snapshot = await firestore.getDoc(PATH, DOCUMENT_ID)
  if (!snapshot.exists) {
    throw Error(`${PATH}${DOCUMENT_ID}/${snapshot.id} is not exists`)
  }
  return firestore.recursiveDelete(PATH, snapshot.ref)
}
```

## Alter File

```ts
import { ActionArg } from 'alter-firestore/types/command'
import { AlterOptions } from 'alter-firestore/types/options'

export const exec = async ({ firestore }: ActionArg<AlterOptions>) => {
  const snapshot = await firestore.getDoc('{path}', '{documentId}')
  if (snapshot.exists) {
    throw Error(`${'{path}'}${'{documentId}'}/${snapshot.id} is already exists`)
  }
  return firestore.create('{path}', '{documentId}', value)
}
```

## Commands

| command          | description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| alter            | run target file                                                     |
| generate         | generate templates                                                  |
| migrate          | migrate firestore collection / document from target directory files |
| migrate:rollback | rollback the previous step                                          |
| migrate:refresh  | rollback the previous step and migrate                              |

## Implementation Plan

- migrate without cli
- enrich log
