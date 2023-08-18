import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { PostsDataInterface } from "~/interfaces/posts.interfaces";
import { getPostListings } from "~/models/post.server";

export const loader: LoaderFunction = async () => {
  return json(await getPostListings());
};

export default function AdminRoute() {
  const posts = useLoaderData() as PostsDataInterface[];

  return (
    <main className="grap-4 grid grid-cols-6">
      <div className="posts-list col-span-2 grid">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={post.slug}
            className="text-blue-600 underline"
          >
            {" "}
            {post.title}{" "}
          </Link>
        ))}
      </div>
      <div className="col-span-4">
        <Outlet />
      </div>
    </main>
  );
}
