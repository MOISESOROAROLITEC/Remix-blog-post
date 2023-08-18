import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Post } from "~/interfaces/posts.interfaces";
import { getPostListings } from "~/models/post.server";

export const loader: LoaderFunction = async () => {
  return json(await getPostListings());
};

export default function AdminRoute() {
  const posts = useLoaderData() as Post[];

  return (
    <main className="grap-5 grid grid-cols-12">
      <div className="posts-list col-span-3 col-start-2 block">
        {posts.map((post) => (
          <div key={post.slug}>
            <Link to={post.slug} className="text-blue-600 hover:underline">
              {" "}
              {post.title}{" "}
            </Link>
          </div>
        ))}
      </div>
      <div className="col-span-6 col-start-6">
        <Outlet />
      </div>
    </main>
  );
}
