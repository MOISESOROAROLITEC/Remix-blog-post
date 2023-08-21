import { Post } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { createPost, getPostById, updatePost } from "~/models/post.server";
import { requireAdmin } from "~/session.server";

type ActionData =
  | {
      slug: string | null;
      title?: string | null;
      markdown?: string | null;
    }
  | undefined;

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdmin(request);
  const { postId } = params;
  if (postId) {
    const post = await getPostById(postId);
    if (post) {
      return json({ post });
    }
  }
  return json({});
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const slug = formData.get("slug");
  const title = formData.get("title");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    slug: slug ? null : "Le champ Slug est réquis",
    title: title ? null : "Le champ Titre est réquis",
    markdown: markdown ? null : "Le champ Markdown est réquis",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(
    typeof title === "string",
    "Le titre doit être une chaine de caractère "
  );
  invariant(
    typeof slug === "string",
    "L'identifian doit être une chaine de caractère "
  );
  invariant(
    typeof markdown === "string",
    "La description doit être une chaine de caractère "
  );

  const postId = params.postId ?? "new";

  if (postId === "new") {
    await createPost({ slug, title, markdown });
  } else {
    await updatePost(postId, { slug, title, markdown });
  }
  return redirect("/posts/admin");
};

export default function CreateNewPostRoute() {
  const inputClassName = "w-full rounded border border-grey-500 px-2 text-lg";
  const errorsClassName = "block w-full text-center text-sm text-red-300 ";
  const data = useLoaderData<{ post?: Post }>();

  const [markdown, setMarkdown] = useState(data.post ? data.post.markdown : "");
  const [isNewPost, setIsNewPost] = useState(Boolean(!data.post?.slug));
  const transition = useNavigation();

  const errors = useActionData<ActionData>();
  const isLoading = Boolean(transition.formAction);

  useEffect(() => {
    if (data.post) {
      setMarkdown(data.post.markdown);
      setIsNewPost(Boolean(!data.post.slug));
    }
  }, [data.post]);

  return (
    <Form method="post" key={data.post?.slug ?? "new"}>
      <p className="mb-3">
        <label>
          Identifiant
          <input
            type="text"
            defaultValue={data.post?.slug}
            className={inputClassName}
            name="slug"
            placeholder="entrez_l-id_du_post"
          />
        </label>
        {errors?.slug ? (
          <span className={errorsClassName}> {errors?.slug} </span>
        ) : null}
      </p>
      <p className="mb-3">
        <label>
          Titre
          <input
            className={inputClassName}
            defaultValue={data.post?.title}
            type="text"
            name="title"
            placeholder="Entrez le titre ici"
          />
        </label>
        {errors?.title ? (
          <span className={errorsClassName}> {errors?.title} </span>
        ) : null}
      </p>
      <p className="mb-2">
        <label>
          Description
          <textarea
            id="markdown"
            defaultValue={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={`${inputClassName} font-mono`}
            name="markdown"
            rows={4}
            placeholder="Entrez la description du post"
          />
        </label>
        {errors?.markdown ? (
          <span className={errorsClassName}> {errors?.markdown} </span>
        ) : null}
      </p>
      <div className="mx-6 my-2 h-32 rounded-lg border-2 border-blue-400 bg-blue-200">
        <div className=" border-b-2 border-blue-500 text-center font-black text-blue-800">
          Aperçu de la description
        </div>
        <div
          className="m-3"
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        ></div>
        {!markdown && (
          <div className="text-center font-thin">Aucune description saisie</div>
        )}
      </div>
      <p className="flex justify-end">
        <Link
          to={".."}
          className="mr-4 rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 active:bg-red-700 "
        >
          Annuler
        </Link>

        <button
          type="submit"
          className={
            isLoading
              ? "rounded bg-blue-400 px-5 py-2 text-white"
              : "rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600 active:bg-blue-700"
          }
          disabled={isLoading}
        >
          {isLoading && isNewPost && "Création en cours..."}
          {!isLoading && isNewPost && "Créer un post"}
          {isLoading && !isNewPost && "Enregistrement ..."}
          {!isLoading && !isNewPost && "Enregistrer"}
        </button>
      </p>
    </Form>
  );
}
