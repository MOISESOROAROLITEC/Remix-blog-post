import { Link, Outlet } from "@remix-run/react";
import { useOptionalAdmin } from "~/utils";

export default function PostsRoute() {
  const isAdmin = useOptionalAdmin();
  return (
    <main className="mb-5">
      <header className="mb-5 grid grid-cols-6 ">
        <Link
          className="col-span-2 col-start-2 text-center text-lg font-black text-blue-900 hover:underline md:text-2xl"
          to={"/"}
        >
          Page d'acceuil
        </Link>
        {isAdmin && (
          <Link
            className="col-span-2 col-start-4 text-center text-lg font-black text-blue-900 hover:underline md:text-2xl"
            to={"admin"}
          >
            Admin
          </Link>
        )}
      </header>
      <Outlet />
    </main>
  );
}
