///
/// This page is like the "bootloader" of the service worker who watch over client
///

const channel = new BroadcastChannel('rm-messages');

///
/// ServiceWorker init
///
// thanks to https://stackoverflow.com/questions/38168276/navigator-serviceworker-controller-is-null-until-page-refres
self.addEventListener('install', function(event) {
     event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    //self.registration.unregister();
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

///
/// Handle communications with client
///

var reqNum = 0, reqsCbks = {};
channel.addEventListener('message', event => {
    var d = event.data;
    var reqCbk = reqsCbks[d.reqId];
    if(reqCbk)
        reqCbk(d);
});

function postMessage(msg, cbk){
    msg.reqId = reqNum++;
    reqsCbks[msg.reqId] = cbk;
    
    msg.from = 'rm';

    channel.postMessage(msg);
}

///
/// Requestes to client 
///
const Reqs = {
    fetch: function(url, cbk){
        postMessage({
            req: 'fetch',
            dest: 'p',   // destination (or receiver): process
            url: url
        }, cbk);
    }  
};

///
/// Interceptors
self.addEventListener('fetch', function(event) {
    console.log("REQUEST:", event);
    var url = event.request.url;
    
    if(!url.includes('.ejs')){
        console.log('normal fetch of', url);
        event.respondWith(fetch(url));
    }
    else {
        console.log('includes ejs!');
           
        /// Non mi resta che immaginare che sia qua il problema...
        event.respondWith(new Promise(function(resolver) {                           
            Reqs.fetch(url, (data)=>{
                console.log('response!', data);
                resolver(new Response(data.body, {
                  headers: { "Content-Type" : "text/plain" }
                }));
            });
        }));
        
    }

});