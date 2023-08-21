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
      <Link to={"new"} className="text-blue-600 underline">
        {" "}
        Créer un nouveau post{" "}
      </Link>
    </div>
  );
}
