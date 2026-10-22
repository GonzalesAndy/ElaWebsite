/** www.elarepka.com/anything → https://elarepka.com/anything (one address for search engines). */
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "elarepka.com";
    return Response.redirect(url.toString(), 301);
  },
};
