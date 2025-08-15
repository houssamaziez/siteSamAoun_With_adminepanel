import React from 'react';
import { categories } from '../../data/mockData';
import * as Icons from 'lucide-react';

interface NavigationProps {
  onCategorySelect: (categorySlug: string) => void;
}

export function Navigation({ onCategorySelect }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onCategorySelect('all')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              All Products
            </button>
            
            {categories.map((category) => {
              const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.slug)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="hidden sm:inline">{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Services
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Support
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}