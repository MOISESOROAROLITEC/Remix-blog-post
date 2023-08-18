import { Link } from "@remix-run/react";

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
