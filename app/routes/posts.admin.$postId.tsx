import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import {
  Post,
  createPost,
  deletePost,
  getPostById,
  updatePost,
} from "~/models/post.server";
import { requireAdmin } from "~/session.server";

type ActionData =
  | {
      slug: string | null;
      title?: string | null;
      markdown?: string | null;
    }
  | undefined;

type LoaderData = {
  post?: Post;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdmin(request);
  invariant(params.postId, "Le champ Slug est réquis");
  if (params.postId === "new") {
    return json<LoaderData>({});
  }

  const post = await getPostById(params.postId);
  if (!post) {
    throw new Response("Post Not Found", { status: 404 });
  }
  return json<LoaderData>({ post });
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireAdmin(request);
  const postId = params.postId;
  invariant(postId, "L'id du post (postId) est requis");

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
  const intent = formData.get("intent") || "create";

  if (intent === "update") {
    await updatePost(postId, { slug, title, markdown });
  } else if (intent === "delete") {
    await deletePost(postId);
  } else {
    await createPost({ slug, title, markdown });
  }
  return redirect("/posts/admin");
};

export default function CreateNewPostRoute() {
  const inputClassName = "w-full rounded border border-grey-500 px-2 text-lg";
  const errorsClassName = "block w-full text-center text-sm text-red-300 ";

  const data = useLoaderData<{ post?: Post }>();
  const errors = useActionData<ActionData>();
  const transition = useNavigation();

  const isCreating = transition.formData?.get("intent") === "create";
  const isUpdating = transition.formData?.get("intent") === "update";
  const isDeleting = transition.formData?.get("intent") === "delete";

  const isNewPost = !data.post?.slug;
  const [markdown, setMarkdown] = useState(
    data.post?.markdown ? data.post.markdown : ""
  );

  useEffect(() => {
    if (data.post) {
      setMarkdown(data.post.markdown);
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
            defaultValue={data.post?.markdown}
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
          dangerouslySetInnerHTML={{
            __html: marked(markdown),
          }}
        ></div>
        {!markdown && (
          <div className="text-center font-thin">Aucune description saisie</div>
        )}
      </div>
      <p className="flex justify-end">
        <Link
          to={".."}
          className="mr-4 rounded bg-red-400 px-5 py-2 text-white hover:bg-red-600 active:bg-red-700 "
        >
          Annuler
        </Link>

        {!isNewPost && (
          <button
            type="submit"
            value="delete"
            name="intent"
            className={
              isDeleting
                ? "mr-4 rounded bg-red-400 px-5 py-2 text-white"
                : "mr-4 rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 active:bg-red-700"
            }
            disabled={isDeleting || isCreating || isUpdating}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        )}

        <button
          type="submit"
          value={isNewPost ? "create" : "update"}
          name="intent"
          className={
            isCreating || isUpdating
              ? "rounded bg-blue-400 px-5 py-2 text-white"
              : "rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600 active:bg-blue-700"
          }
          disabled={isCreating || isUpdating || isDeleting}
        >
          {isNewPost
            ? isCreating
              ? "Création en cours..."
              : "Créer un post"
            : isUpdating
            ? "Sauvegarde ..."
            : "Sauvegarder"}
        </button>
      </p>
    </Form>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  const param = useParams();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <div className="error-message">
          Le Post ayant pour identifiant{" "}
          <span className="text-red-500"> {param.postId} </span> est introuvable
        </div>
        <div className="error-status mt-8 text-center text-2xl font-bold tracking-[.5rem]">
          {" "}
          {error.status}{" "}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div> Une erreur Inconnue s'est produite</div>
      <div
        className="border-black-800 custom-scroll  bg-neutral-600 p-5 text-red-400"
        style={{ maxHeight: "350px !important" }}
      >
        <code>{error.message}</code>
      </div>
    </div>
  );
}
