///
/// This page is like the "bootloader" of the service worker who watch over client
///

const channel = new BroadcastChannel('sw-messages');

///
/// ServiceWorker init
///
// thanks to https://stackoverflow.com/questions/38168276/navigator-serviceworker-controller-is-null-until-page-refresh
self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

///
/// Handle communications with client
///
channel.addEventListener('message', event => {
    console.log('Received', event.data);
    channel.postMessage({title: 'Hello to you'});
});

///
/// Requestes to client 
///
const Reqs = {
    fetch: function(url, cbk){
        channel.postMessage({
            req: 'fetch',
            dir: 'p',   // direction (or receiver): process
            url: url
        });
    }  
};

///
/// Interceptors
///
self.addEventListener('fetch', function(event) {
    console.log("REQUEST:", event);
    var url = event.request.url;
    
    if(!url.endsWith('.ejs')){
        console.log('normal fetch of', url);
        event.respondWith(fetch(url));
    }
    else {
        ipcRenderer.send('page-request', [url]);

        event.respondWith(new Response("test", {
          headers: { "Content-Type" : "text/plain" }
        }));
    }
    
    return;
});