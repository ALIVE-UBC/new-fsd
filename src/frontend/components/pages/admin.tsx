import { type ReactNode } from 'react';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';

type ModelItem = {
  name: string;
  addLink?: string;
  viewLink?: string;
};

type Section = {
  title: string;
  models: ModelItem[];
};

const sections: Section[] = [
  {
    title: 'Authentication & Authorization',
    models: [
      { name: 'Groups', addLink: '#', viewLink: '#' },
      { name: 'Users', addLink: '#', viewLink: '#' },
    ],
  },
  {
    title: 'Metrics',
    models: [
      { name: 'Events', addLink: '#', viewLink: '#' },
      // You can add more rows as needed
    ],
  },
];



// Export as a ReactNode so it can be passed directly as a child
export const AdminPage: ReactNode = (
 <div className="p-6 space-y-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        Dashboard/ <span className="text-gray-900 font-semibold">Admin</span>
      </nav>

      {sections.map((section, idx) => (
        <div key={section.title} className={idx === 0 ? 'border rounded-md' : 'border rounded-md'}>
          <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium text-gray-700">
            {section.title}
          </div>

          <div className="grid grid-cols-3 text-xs text-gray-500 border-b px-4 py-2 font-semibold">
            <div>MODEL NAME</div>
            <div>ADD LINK</div>
            <div>CHANGE OR VIEW LIST LINK</div>
          </div>

          {section.models.map((model) => (
            <div
              key={model.name}
              className="grid grid-cols-3 items-center px-4 py-3 text-sm text-gray-800 border-b"
            >
              <div>{model.name}</div>
              <div>
                <a href={model.addLink} className="inline-flex items-center justify-center text-gray-500 hover:text-blue-600">
                  <PlusIcon className="h-5 w-5" />
                </a>
              </div>
              <div>
                <a href={model.viewLink} className="inline-flex items-center justify-center text-gray-500 hover:text-blue-600">
                  <PencilSquareIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
);
