import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPostListings } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader = async () => {
  const posts = await getPostListings();
  return json<LoaderData>({ posts });
};

export default function PostsRoute() {
  return (
    <main>
      <header className="mb-5 grid grid-cols-6 ">
        <Link
          className="col-span-2 col-start-2 text-center text-2xl font-black text-blue-900 hover:underline"
          to={"/"}
        >
          Page d'acceuil
        </Link>
        <Link
          className="col-span-2 col-start-4 text-center text-2xl font-black text-blue-900 hover:underline"
          to={"admin"}
        >
          Admin
        </Link>
      </header>
      <Outlet />
    </main>
  );
}
