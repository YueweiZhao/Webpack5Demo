# WebpackDem 

1. a simple webpack demo to test the configs of webpack5
- webpack.config.js: the common configs of webpack5;
- use "yarn run dev" to run webpack;

2. a diy loader to pack css and scss
- webpack.config.custom.js: the config to run diy loader;
- ~/custom/myLoaders: the loaders to pack css or scss;
- use "resolveLoader" in config to tell the webpack where to find my diy loader;
- use "yarn run custom" to run loader;

3. a diy plugin to output the size of each bundle
- webpack.config.custom.js: the config to run diy plugin;
- the size of bundles will be shown in ~/dist/fileSize.txt;
- use "yarn run custom" to run plugin;


4. a simple diy webpack to pack the ES6 codes
- ~/lib/webpack.config.js: the config to run diy webpack;
- ~/lib/webpack.js: the diy webpack;
- use "yarn run custom1" to run diy webpack;