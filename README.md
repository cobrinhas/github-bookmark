# chrome-extension-typescript-tailwindcss

Spike to create a Google Chrome extension that is developed in TypeScript + TailwindCSS

## How did I achieve it?

TypeScript support enabled using [chrome-extensions-typescript](https://github.com/freitas-labs/chrome-extension-typescript) spike. TailwindCSS configured using [official installation doc](https://tailwindcss.com/docs/installation).

![tailwind](tailwind.png)

## Scripts

- `npm run build` to transpile and bundle files in `.cjs`, `.js`, `.d.ts` and respective source-maps
- `npm run start` to run the project with hot-reload
- `npm run test` to run the unit tests
- `npm run lint` to analyze and lint the project
- `npm run format` to format the project based on lint feedback
- `npm run docs` to generate docs site
- `npm run docs:publish` to generate docs site and publish it to GitHub Pages

## Hooks

This repository is configured with client-side Git hooks that automatically format + lint the codebase before each push. You can install it by running the following command:

```bash
./hooks/INSTALL
```

---

### Contact

This template was prepared by:

- João Freitas, @freitzzz
- Rute Santos, @rutesantos4

Contact us for freelancing work!
