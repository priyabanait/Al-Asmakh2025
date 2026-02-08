import DemoPage from '../../components/DemoPage'

export default function Demo() {
  return (
    <DemoPage title="Sidebar Demo">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use the Reusable Sidebar</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 mb-4">
              The Sidebar component is designed to be reusable across different pages. Here's how to implement it:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">1. Import the Component</h3>
              <code className="text-sm text-blue-600">import Sidebar from './Sidebar'</code>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">2. Set up State Management</h3>
              <pre className="text-sm text-blue-600 whitespace-pre-wrap">
{`const [sidebarOpen, setSidebarOpen] = useState(false)
const [activeMenuItem, setActiveMenuItem] = useState('dashboard')`}
              </pre>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">3. Use the Component</h3>
              <pre className="text-sm text-blue-600 whitespace-pre-wrap">
{`<Sidebar 
  isOpen={sidebarOpen}
  onToggle={toggleSidebar}
  activeItem={activeMenuItem}
  onItemClick={handleMenuItemClick}
/>`}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Mobile responsive design
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Collapsible on desktop
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Overlay on mobile
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Active state management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Smooth animations
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Breakpoints</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="font-medium text-red-800">Mobile (&lt; 1024px)</span>
                <span className="text-red-600">Overlay sidebar</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="font-medium text-blue-800">Desktop (&ge; 1024px)</span>
                <span className="text-blue-600">Collapsible sidebar</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="font-medium text-green-800">Large (&ge; 1280px)</span>
                <span className="text-green-600">Full sidebar with labels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  )
}

export const metadata = {
  title: 'Sidebar Demo - Al Asmakh',
  description: 'Demonstration of the reusable sidebar component',
}
