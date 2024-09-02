# create-enpage

> Creates templates for Enpage.


## Local development

### Testing with tsx

### Testing the build

> ⚠️ Important: the following steps work for `npm`but not for `pnpm`

1. Clone this repository and run :
  1. `pnpm install` and `pnpm build` at the root.
  2. `pnpm pack:test` in the `packages/create-enpage` directory.
2. Create another directory named `test-create-enpage` **outside the monorepo**, like one level up. You should have the following structure:

```
- enpage (monorepo)
  - packages
    - create-enpage
    - [...]
  - [...]
- test-create-enpage
```

3. Go to the newly created directory and test the package:

```sh
cd test-create-enpage
npx ../enpage/packages/create-enpage/create-enpage-test.tgz my-template
```
