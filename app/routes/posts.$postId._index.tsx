import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";
import { getPostById } from "~/models/post.server";

type LoadedData = {
  title: string;
  html: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { postId } = params;
  invariant(postId, "L'id du post est introuvable");
  const post = await getPostById(postId);
  invariant(post, `Le post ${postId} est introuvable`);
  const html = marked(post.markdown);
  return json<LoadedData>({ title: post.title, html });
};

export default function PostsRoute() {
  const { title, html } = useLoaderData() as LoadedData;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="my-6 border-b-2 text-center text-3xl"> {title} </div>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
