import { Link, useLoaderData } from "@remix-run/react";

interface postsDataInterface {
  slug: string;
  title: string;
}

export const loader = async () => {
  const posts: postsDataInterface[] = [
    {
      slug: "faire-la-sesive",
      title: "Faire la lessive",
    },
    {
      slug: "epargner-de-l_argent",
      title: "Epargner de l'argent",
    },
  ];

  const postsString = JSON.stringify(posts);

  return new Response(postsString, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default function PostRoute() {
  const posts = useLoaderData<postsDataInterface[]>();

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
    </main>
  );
}
