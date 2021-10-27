addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
const baseUrl = "https://nextjs.web-templates.io";
async function handleRequest(request) {
    const { pathname, search } = new URL(request.url);

    if (pathname.startsWith("/json/")) {
        return fetch(baseUrl + pathname + search, {
            headers: { "Accepts": "application/json" },
        });
    }

    return fetch(baseUrl);
}