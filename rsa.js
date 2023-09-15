function hasStorageAccess(targetSite, callback) {
    document.hasStorageAccess().then((hasAccess) => {
        console.log(`${document.hasStorageAccess.name}: ${hasAccess}`);
        callback(hasAccess);
        if (hasAccess) {
            // You can access storage in this context
            setCookie('test=123');
        } else {
            // You have to request storage access
            if (targetSite) {
                requestTopLevelAccess(targetSite, (res) => {
                    if (res === true) {
                        setCookie('test=123');
                    }
                });
            } else {
                requestAccess((res) => {
                    if (res === true) {
                        setCookie('test=123');
                    }
                });
            }
        }
    });
}
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
            const btn = document.createElement("button");
            btn.textContent = "Grant access";
            btn.addEventListener('click', () => {
                // Request storage access
                rSA(callback);
            });
            document.body.appendChild(btn);
        }
    });
}
function requestTopLevelAccess(targetSite, callback) {
    navigator.permissions.query({ name: 'top-level-storage-access', requestedOrigin: targetSite }).then(res => {
        console.log(`${requestTopLevelAccess.name}: ${res.state}`);
        if (res.state === 'granted') {
            // Permission has already been granted
            // You can request storage access without any user gesture
            rSAFor(targetSite, callback);
        } else if (res.state === 'prompt') {
            // Requesting storage access requires user gesture
            // For example, clicking a button
            const btn = document.createElement("button");
            btn.textContent = "Grant access";
            btn.addEventListener('click', () => {
                // Request storage access
                rSAFor(targetSite, callback);
            });
            document.body.appendChild(btn);
        }
    });
}
function rSAFor(targetSite, callback) {
    if ('requestStorageAccessFor' in document) {
        document.requestStorageAccessFor(targetSite).then(

            (res) => {
                console.log(`${rSAFor.name}: ${res}`);
                // Use storage access
                callback(true);
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
                console.log(`${rSA.name}: ${res}`);
                // Use storage access
                callback(true);
            },
            (err) => {
                console.log(`${rSA.name}: ${err}`);
                // Handle errors
                callback(false);
            }
        );
    }
}
function setCookie(value) {
    document.cookie = value; // set a cookie
}