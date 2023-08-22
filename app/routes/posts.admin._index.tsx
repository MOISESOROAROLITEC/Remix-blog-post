import { LoaderFunction, json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { requireAdmin } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdmin(request);
  return json({});
};

export default function AdminIndexRoute() {
  return (
    <div className="admin-index-page">
      <Link
        to={"new"}
        className="text-md rounded-lg bg-gray-100 px-5 py-2 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 hover:underline"
      >
        {" "}
        Créer un nouveau post{" "}
      </Link>
    </div>
  );
}
