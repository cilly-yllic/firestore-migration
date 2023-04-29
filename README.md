# alter-firestore
## installation

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
```

### set alfsrc.js

```js
export default {
  emulator: {
    options: {
      projectId: ''
    },
    ports: {
      auth: '', // ex: 9099
      firestore: '', // ex: 8080
      storage: '', // ex: 9199
    }
  },
  credentialPaths: {
    '{this key use for --project option}': '' // ex: staging: './.envs/staging/firebase-admin-sdk.json'
  },
  collectionName: "migrations", // <-- default
  fileDirectoryPath: 'migrations-files', // <-- default ex: firestore/migrations/files
  aliases: {
     '{key}': [ '{filepath}']
  }
}
```

## Commands
| command | description                                                         |
|---------|---------------------------------------------------------------------|
| migrate | migrate firestore collection / document from target directory files |
| alter   | run target file                                                     |


## Implementation Plan
- clean migration
- rollup
- create templates
- run migration without cli