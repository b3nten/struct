# Dais

A minimal starter template for Deno libraries that can be converted and published to NPM. To use, clone and `rm -r .git`

## Scripts

### Dev
Run entry file (mod.ts).
```
deno task dev
```

### Test
Run test suite.
```
deno task test
```
### NPM
Ensure the NPM configuration is correct in `scripts/build.ts`.
```
deno task npm 0.0.1
```
### Build
Build mod.ts as a minified js file.
```
deno task build
```