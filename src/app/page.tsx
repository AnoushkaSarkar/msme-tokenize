export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50">
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl font-black mb-4">
          <span className="gradient-text">MSME Tokenize</span>
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Micro Equity Tokenisation Platform for Indian MSMEs
        </p>
        <p className="text-4xl font-bold text-saffron mb-8">
          63 Million MSMEs. Zero Equity Access. Until Now.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="card text-center">
            <p className="text-3xl font-bold text-primary-600">₹100</p>
            <p className="text-sm text-gray-500">Minimum Investment</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-india-green">63M+</p>
            <p className="text-sm text-gray-500">Indian MSMEs</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-saffron">₹43L Cr</p>
            <p className="text-sm text-gray-500">MSME GDP Contribution</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-400">
          🔧 Platform is being built... Stay tuned!
        </p>
      </div>
    </div>
  );
}