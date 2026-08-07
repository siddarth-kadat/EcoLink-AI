import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-8xl font-black text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
