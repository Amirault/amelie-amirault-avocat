const unauthorized = () =>
  new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Site"' },
  });

export default async function protectSite(request, context) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/.netlify/")) {
    return context.next();
  }

  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorized();
  }

  const credentials = atob(authorization.slice("Basic ".length));
  const password = credentials.slice(credentials.indexOf(":") + 1);
  const sitePassword = Netlify.env.get("SITE_PASSWORD");

  if (!sitePassword || password !== sitePassword) {
    return unauthorized();
  }

  return context.next();
}
