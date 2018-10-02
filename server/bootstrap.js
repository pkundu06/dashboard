require('ignore-styles');
require('babel-register')({
    ignore: [ /(node_modules)/ ],
    presets: ['es2015', 'react']
});
require('./server');