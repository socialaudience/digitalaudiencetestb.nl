function hasStorageAccess(targetSite, callback) {
    document.hasStorageAccess().then((hasAccess) => {
        console.log(`${document.hasStorageAccess.name}: ${hasAccess}`);
        if (hasAccess) {
            // You can access storage in this context
            callback(hasAccess);
        } else {
            // You have to request storage access
            if (targetSite) {
                requestTopLevelAccess(targetSite, (res) => {
                    callback(res);
                });
            } else {
                requestAccess((res) => {
                    callback(res);
                });
            }
        }
    });
}
//For embedded iframe 
function requestAccess(callback) {
    navigator.permissions.query({ name: 'storage-access' }).then(res => {
        console.log(`${requestAccess.name}: ${res.state}`);
        if (res.state === 'granted') {
            // Permission has already been granted
            // You can request storage access without any user gesture
            rSA(callback);
        } else if (res.state === 'prompt') {
            // Requesting storage access requires user gesture
            // For example, clicking a button
            userInput(() => { rSA(callback); });
        }
    });
}
//For top level site
function requestTopLevelAccess(targetSite, callback) {
    navigator.permissions.query({ name: 'top-level-storage-access', requestedOrigin: targetSite }).then(res => {
        console.log(`${requestTopLevelAccess.name}: ${res.state}`);
        if (res.state === 'granted') {
            // Permission has already been granted
            // You can request storage access without any user gesture
            rSAFor(targetSite, callback);
        } else if (res.state === 'prompt') {
            userInput(() => { rSAFor(targetSite, callback) });
        }
    });
}
function userInput(callback) {
    const btn = document.createElement("button");
    btn.textContent = "Grant";
    btn.addEventListener('click', () => {
        callback();
        btn.remove();
    });
    document.body.appendChild(btn);
}
function rSAFor(targetSite, callback) {
    if ('requestStorageAccessFor' in document) {
        document.requestStorageAccessFor(targetSite).then(

            (res) => {
                console.log(`${rSA.name}: ${true}`);
                // Use storage access
                callback(true);
                checkCookie();
            },
            (err) => {
                console.log(`${rSAFor.name}: ${err}`);
                // Handle errors
                callback(false);
            }
        );
    }
}
function rSA(callback) {
    if ('requestStorageAccess' in document) {
        document.requestStorageAccess().then(
            (res) => {
                console.log(`${rSA.name}: ${true}`);
                // Use storage access
                callback(true);
                checkCookie();
            },
            (err) => {
                console.log(`${rSA.name}: ${err}`);
                // Handle errors
                callback(false);
            }
        );
    }
}
function checkCookie() {
    fetch('https://cookiebaker.test.digitalaudience.link/bakery/bake?car=0&returndaid=1', {
        method: 'GET',
        credentials: 'include'
    })
        .then((response) => response.text())
        .then((text) => {
            // Do something
            console.log(text);
        });
}