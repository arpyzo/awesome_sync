function getBookmarkTree(bookmarkNode) {
    let bookmarks = [];

    for (child of bookmarkNode.children) {
        if (child.children === undefined) {
            bookmarks.push({ title: child.title, url: child.url});
        } else {
            bookmarks.push({title: child.title, children: getBookmarkTree(child)});
        }
    }

    return(bookmarks);
}

async function handleClick() {
    const deviceName = "floofy_new";
    const rootTitle = "Linux"; // "Bookmarks Menu";


    function setDeviceName(result) {
        let dname = result.deviceName || 'default';
        console.log(`Device name: ${dname}`);
    }

    function onError(error) {
        console.log(`Error loading device name from storage: ${error}`);
    }
    browser.storage.local.get("deviceName").then(setDeviceName, onError);
return;
    let bookmarks = [];
    try {
        // returns array of nodes
        const nodesFound = await browser.bookmarks.search({title: rootTitle});
        if (nodesFound.length == 0) {
            throw("starting title not found");
        }

        // uses id of first node to get the node with children
        // getSubTree returns an array with only the one node
        const rootNode = await browser.bookmarks.getSubTree(nodesFound[0].id);

        bookmarks = getBookmarkTree(rootNode[0]);
    } catch (err) {
        // TODO: change this to a notification
        console.error("Error retrieving bookmarks:", err);
        return;
    }

    const bookmarkJson = JSON.stringify({ deviceName: deviceName, bookmarks: bookmarks });
    console.log(bookmarkJson);

    const response = await fetch('http://www.orbitry.com/bookmarks/cgi/test.cgi', { method: 'POST', body: encodeURI(bookmarkJson) });
    console.log("Response status: " + response.status);
}

browser.browserAction.onClicked.addListener(handleClick);
