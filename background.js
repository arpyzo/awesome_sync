function notify(message) {
    // TODO: add red icon
    browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("blue_arrow_48.png"),
        "title": "Awesome Sync",
        "message": message
    });
}

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
    const rootTitle = "Linux"; // "Bookmarks Menu";
    let deviceName = "";

    try {
        deviceName = (await browser.storage.local.get("deviceName")).deviceName || "";
        if (deviceName == "") {
            throw("device name is empty");
        }
    } catch (error) {
        console.error("Error getting device name from local storage:", error);
        notify(`Error: ${error}`);
        return;
    }

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
    } catch (error) {
        console.error("Error retrieving bookmarks", error);
        notify(`Error: ${error}`);
        return;
    }

    const bookmarkJson = JSON.stringify({ deviceName: deviceName, bookmarks: bookmarks });

    const response = await fetch('http://www.orbitry.com/bookmarks/cgi/test.cgi', { method: 'POST', body: encodeURI(bookmarkJson) });
    response.ok ? notify("Sync successful") : notify("Sync failed");
    console.log(`Response status: ${response.status}`);
}

browser.browserAction.onClicked.addListener(handleClick);
