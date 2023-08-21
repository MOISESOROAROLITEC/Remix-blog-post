import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { getEnv } from "./env.server";
import "./index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  return json<LoaderData>({ user: await getUser(request), ENV: getEnv() });
};

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="custom-scroll">
          <Outlet />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV=${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
