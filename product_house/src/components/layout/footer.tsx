export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} AI Product Development Assistant
            </div>
            <div className="mt-2 md:mt-0 text-sm text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </footer>
    );
  }