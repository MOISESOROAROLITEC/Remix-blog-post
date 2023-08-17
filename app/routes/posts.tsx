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
    <div>
      <h2>
        <Link
          className="text-2xl font-black text-blue-900 hover:underline"
          to={"/"}
        >
          Page d'acceuil
        </Link>
      </h2>
      <Outlet />
    </div>
  );
}
