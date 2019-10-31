const { shantiApp } = require('./index.js');

shantiApp.ready(()=>{
    shantiApp.loadWindow('./editor/index.html');
});
