import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">AI Product Development Assistant</h1>
        <p className="text-xl mb-8">
          Transform your product ideas into comprehensive documentation with the power of AI.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/auth" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Get Started
          </Link>
          <Link 
            href="/dashboard" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Dashboard
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Conversational Interface</h2>
          <p>Interact naturally with AI to gather and refine product requirements.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Automatic Documentation</h2>
          <p>Generate comprehensive documentation in multiple formats with a single click.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Collaborative Review</h2>
          <p>Review, comment, and iterate on masterplans with your team.</p>
        </div>
      </div>
    </div>
  );
}