import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function PostRoute() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <main>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {" "}
              {post.title}{" "}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-red-800">
        <Link to={"/"}>Acceuil</Link>
      </h2>
    </main>
  );
}
