import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
          <div className="bg-white p-8 max-w-lg shadow-sm border border-red-200">
            <h1 className="text-xl font-bold text-red-600 mb-4">Module Error</h1>
            <p className="text-sm text-gray-700 mb-4">
              Something went wrong while loading this section of the application. 
              Please refresh the page or navigate back.
            </p>
            <pre className="text-xs bg-gray-100 p-4 overflow-auto max-h-48 text-gray-800">
              {this.state.error && this.state.error.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
