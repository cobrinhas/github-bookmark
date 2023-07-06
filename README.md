# github-bookmark 📖

A micro browser extension that saves a web page URL as a GitHub issue

## Why?

Everyday I share an article I've read in my [blog](https://joaomagfreitas.link/reads). Usually I bookmark articles to read in the next few days, but I rarely access my bookmark folder to revisit them 🤷 My solution for this problem is to post the articles I certainly know I want to read, as an issue in my blog GitHub repository. This extension helps me automate the process of creating the issue, by mimicking the process of bookmarking a page in the browser.

## How does it looks like?

https://github.com/cobrinhas/github-bookmark/assets/26190214/da284333-3ea6-4ee5-8903-1eed3d4ef400

## How do I install it?

1. Download the latest release
2. Unzip `dist.zip` to a new folder
3. Import the extension (Chrome > Navigate to extensions `chrome://extensions/` > Load Unpacked > Select `dist` folder available in the repo)

Or...

1. Clone this repo
2. Install dependencies (`npm i`)
3. Build the extension (`npm run build`)
4. Import the extension (Chrome > Navigate to extensions `chrome://extensions/` > Load Unpacked > Select `dist` folder available in the repo)

---

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
