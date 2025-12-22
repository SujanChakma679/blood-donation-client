import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Oops!
        </h1>

        <p className="text-gray-600 mb-4">
          The page you are looking for doesn’t exist or you don’t have access.
        </p>

        <p className="text-sm text-gray-400 mb-6">
          {error?.statusText || error?.message}
        </p>

        <Link
          to="/"
          className="btn btn-primary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
