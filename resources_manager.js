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
    console.log('received a message', d);
    var reqCbk = reqsCbks[d.reqId];
    if(reqCbk)
        reqCbk(d);
});

function postMessage(msg, cbk){ // fin qui ci arriva, il problema riguarda la ricezione client
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
    
    if(true){ // !url.includes('.ejs')
        console.log('normal fetch of', url);
        //event.respondWith(fetch(url));
        
        var promise = new Promise(function (resolver){
            var res = fetch(url);
            console.log('fetched', res);
            resolver(res);
        });
        
        event.waitUntil(promise);
        event.respondWith(promise);
        
        console.log('responWith promise', promise);
    }
    else {
        console.log('includes ejs!');
        
        event.stopImmediatePropagation();
        
        /// Non mi resta che immaginare che sia qua il problema...
        console.log('before primes');
        event.respondWith(new Promise(function(resolver) {   
            console.log('it didnt call promise');
            Reqs.fetch(url, (data)=>{
                console.log('response!', data);
                
                var response = new Response(data.body, {
                  headers: { "Content-Type" : "text/plain" }
                });
                
                var fakePromise = new Promise(function(fakeResolver){
                    fakeResolver(response);
                });
                
                resolver(fakePromise);
            });
        }));
        
    }

});

setInterval(()=>{
    //console.log('Tags:', Object.keys(self));
    //console.log(self.onsync)
    //console.log('alive');
}, 2000);

function EnableFetchWithArguments() {
    const originalCtxFetch = self.fetch;
    self.fetch = function(url) {
        // Get the parameter in arguments
        // Intercept the parameter here 
        
        if(url.includes('.ejs')){
            console.log('FETCH ejs!', arguments);
            
            var promise = new Promise(function(resolver){
                
                Reqs.fetch(url, (data)=>{
                    console.log('response!', data);
                
                    var response = new Response(data.body, {
                      headers: { "Content-Type" : "text/plain" }
                    });

                    /*var fakePromise = new Promise(function(fakeResolver){
                        fakeResolver(response);
                    });*/

                    resolver(response);
                });
                
                /*setTimeout(function(){
                    resolver(new Response('console.log("miao")', {headers: { "Content-Type" : "text/plain" }}));
                },100);*/ 
            });
            
            return promise;
        }
        else {           
            return originalCtxFetch.apply(this, arguments)
        }
    }
}
EnableFetchWithArguments();