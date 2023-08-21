import { Post } from "@prisma/client";
import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPostListings } from "~/models/post.server";

export const loader: LoaderFunction = async () => {
  return json(await getPostListings());
};

export default function AdminRoute() {
  const posts = useLoaderData() as unknown as Post[];

  return (
    <main className="grid  grid-cols-12 gap-0 sm:gap-5">
      <div className="posts-list col-span-10 col-start-2 block sm:col-span-3  sm:col-start-2">
        <div className="grid grid-cols-2 gap-x-0 gap-y-0 sm:grid-cols-1 sm:gap-y-1">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={post.slug}
              className="text-blue-600 hover:underline"
            >
              {" "}
              {post.title}{" "}
            </Link>
          ))}
        </div>
      </div>
      <div className="col-span-10 col-start-2 mt-10 sm:col-span-6 sm:col-start-6 sm:m-0">
        <Outlet />
      </div>
    </main>
  );
}
