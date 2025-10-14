import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 4h3v7H8V4zm5 0h3v10h-3V4zM8 13h3v7H8v-7z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">logicloop</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Workflow automation
            <br />
            for technical teams
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Build powerful automations with a visual interface. Connect APIs, databases, and services without limits.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-20">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-gray-950 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get started
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="px-8 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:border-gray-600 hover:text-white transition-colors"
            >
              Sign in
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Feature
              title="Visual Builder"
              description="Drag and drop nodes to create complex workflows in minutes"
            />
            <Feature
              title="Self-Hosted"
              description="Deploy on your infrastructure with full control over your data"
            />
            <Feature
              title="Extensible"
              description="Build custom nodes and integrate any API or service"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
