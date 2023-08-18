import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { marked } from "marked";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Post } from "~/interfaces/posts.interfaces";
import { createPost } from "~/models/post.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;

  const errors = {
    slug: slug ? null : "Le champ Slug est réquis",
    title: title ? null : "Le champ Titre est réquis",
    markdown: markdown ? null : "Le champ Markdown est réquis",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json(errors);
  }

  await createPost({ slug, title, markdown });

  return redirect("/posts/admin");
};

const inputClassName = "w-full rounded border border-grey-500 px-2 text-lg";
const errorsClassName = "block w-full text-center text-sm text-red-300 ";

export default function CreateNewPostRoute() {
  const [markdown, setMarkdown] = useState("");
  const errors = useActionData<Post | undefined>();
  return (
    <Form method="post">
      <p className="mb-3">
        <label>
          Identifiant
          <input
            type="text"
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
            value={markdown}
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
      <p className="mx-6 my-2 h-32 rounded-lg border-2 border-blue-400 bg-blue-200">
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
      </p>
      <p className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-700 active:bg-blue-900"
        >
          Enregistrer
        </button>
      </p>
    </Form>
  );
}
