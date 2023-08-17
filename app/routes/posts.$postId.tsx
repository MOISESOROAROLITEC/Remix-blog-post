import { Link, Outlet } from "@remix-run/react";

export default function PostsRoute() {
  return (
    <div>
      <Outlet />
      <h2 className="mt-5 font-bold text-red-800 hover:underline">
        <Link to={"/posts"}>List des posts</Link>
      </h2>
    </div>
  );
}
