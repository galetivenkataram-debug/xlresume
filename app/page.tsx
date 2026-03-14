export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">CareerAI</h1>
        <div className="flex gap-4">
          <a href="#features" className="text-gray-600 hover:text-blue-600 text-sm">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-blue-600 text-sm">Pricing</a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-8 py-20 bg-gradient-to-b from-blue-50 to-white">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          AI-Powered Career Platform for India
        </span>
        <h2 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
          Land Your Dream Job <br />
          <span className="text-blue-600">With the Power of AI</span>
        </h2>
        <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
          Build ATS-ready resumes, get personalized career guidance, and ace every interview — all in one place. Built for Indian graduates and job switchers.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Build My Resume Free
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
            See How It Works
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-400">No credit card required · Free forever plan available</p>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-16 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to get hired
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-3xl mb-3">📄</div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Resume Builder</h4>
            <p className="text-sm text-gray-500">Generate ATS-optimized resumes tailored to any job description in seconds.</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Career Guidance</h4>
            <p className="text-sm text-gray-500">Get a personalized roadmap based on your skills, goals, and the Indian job market.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🧪</div>
            <h4 className="font-semibold text-gray-900 mb-2">Mock Tests</h4>
            <p className="text-sm text-gray-500">Practice aptitude, coding, and HR rounds with AI-generated questions and feedback.</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6">
            <div className="text-3xl mb-3">✉️</div>
            <h4 className="font-semibold text-gray-900 mb-2">Cover Letters</h4>
            <p className="text-sm text-gray-500">Auto-generate compelling cover letters matched to any job posting instantly.</p>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-12 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center text-white">
          <div>
            <p className="text-4xl font-bold">10M+</p>
            <p className="text-blue-200 text-sm mt-1">Graduates in India every year</p>
          </div>
          <div>
            <p className="text-4xl font-bold">3x</p>
            <p className="text-blue-200 text-sm mt-1">Higher callback rate with AI resumes</p>
          </div>
          <div>
            <p className="text-4xl font-bold">Free</p>
            <p className="text-blue-200 text-sm mt-1">To get started today</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-16 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple, affordable pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900">Free</h4>
            <p className="text-3xl font-bold mt-2">₹0<span className="text-sm font-normal text-gray-400">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✅ 3 resume downloads</li>
              <li>✅ 10 mock test questions</li>
              <li>✅ Basic career guidance</li>
            </ul>
            <button className="mt-6 w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50">
              Get Started
            </button>
          </div>

          <div className="border-2 border-blue-600 rounded-xl p-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</span>
            <h4 className="font-bold text-gray-900">Pro</h4>
            <p className="text-3xl font-bold mt-2">₹299<span className="text-sm font-normal text-gray-400">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✅ Unlimited resumes</li>
              <li>✅ Unlimited mock tests</li>
              <li>✅ AI career roadmap</li>
              <li>✅ Cover letter generator</li>
            </ul>
            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
              Start Pro
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900">Premium</h4>
            <p className="text-3xl font-bold mt-2">₹499<span className="text-sm font-normal text-gray-400">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✅ Everything in Pro</li>
              <li>✅ AI mock interviews</li>
              <li>✅ Job match alerts</li>
              <li>✅ Priority support</li>
            </ul>
            <button className="mt-6 w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50">
              Start Premium
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 text-center text-sm text-gray-400">
        © 2026 CareerAI · Built for India · All rights reserved
      </footer>

    </main>
  );
}