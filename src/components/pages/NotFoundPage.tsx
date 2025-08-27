import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button icon={Home} size="lg">
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" icon={Search} size="lg">
              Browse Products
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}