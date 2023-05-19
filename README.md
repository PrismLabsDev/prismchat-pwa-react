# Prism Chat Web (PWA)

This is the PWA web client for the Prism Chat application. This project will replace the [PrismLabsDev/prismchat-spa-react](https://github.com/PrismLabsDev/prismchat-spa-react).

This project was created with [Create React App](https://github.com/facebook/create-react-app) using the [cra-template-pwa-typescript](https://create-react-app.dev/docs/making-a-progressive-web-app/) template.

## Commands

``` bash
# Starts the development server.
npm start

# Bundles the app into static files for production.
npm run build

# Starts the test runner.
npm test
```

## Test Build

It should be noted that when running the application with the start script, the service worker will not register in the browser. You will first need to build the application and serve the build files to actually run the service worker. This can be done with the following instructions.

``` bash
# Build project
npm run build

# Serve build files
node ./node_modules/serve/build/main.js -s build
```
