browser.browserAction.onClicked.addListener((handleClick) => {
        const request = new Request('http://www.orbitry.com/from_6_extension', { method: "GET" });
        fetch(request);
});
