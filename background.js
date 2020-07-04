function getBookmarkTree(bookmarkNode) {
    var bookmarks = [];

    //console.log(bookmarkNode.title);

    for (child of bookmarkNode.children) {
        //console.log(child.title);
        if (child.children === undefined) {
            bookmarks.push({ title: child.title, url: child.url});
        } else {
            bookmarks.push({title: child.title, children: getBookmarkTree(child)});
        }
    }

    return(bookmarks);
}

async function handleClick() {
    //let root_title = "Bookmarks Menu";
    let root_title = "Shiftboard";

    console.log(' *** Handling click ***');

    var bookmarks = [];

    try {
        // returns array of nodes
        let nodes_found = await browser.bookmarks.search({title: root_title});
        if (nodes_found.length == 0) {
            console.error("Bookmark sync root node not found");
            return;
        }
        // uses id of first node to get the node with children
        // getSubTree returns an array with only the one node
        let root_node = await browser.bookmarks.getSubTree(nodes_found[0].id);

        bookmarks = getBookmarkTree(root_node[0]);
    } catch (err) {
        console.error("Error retrieving bookmarks", err);
    }

    console.log(JSON.stringify(bookmarks));

    //const request = new Request('http://www.orbitry.com/bookmarks/cgi/test.cgi', { method: 'POST' });
    //fetch(request);
    fetch('http://www.orbitry.com/bookmarks/cgi/test.cgi', { method: 'POST', body: '{ "bob", "the blob" }' });
}

browser.browserAction.onClicked.addListener(handleClick);
