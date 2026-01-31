import { useState } from "react";
import axios from "axios";

function MarketingGenerator() {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    targetAudience: "",
    platform: "Instagram",
    tone: "Professional"
  });
  
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const categories = ["Electronics", "Fashion", "Food & Beverage", "Beauty", "Home & Garden", "Sports", "Technology", "Health"];
  const platforms = ["Instagram", "LinkedIn", "Twitter", "Facebook", "TikTok"];
  const tones = ["Professional", "Casual", "Humorous", "Inspirational", "Urgent", "Friendly"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMarketing = async () => {
    if (!formData.productName || !formData.description) {
      alert("Please fill in at least product name and description");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("targetAudience", formData.targetAudience);
      formDataToSend.append("platform", formData.platform);
      formDataToSend.append("tone", formData.tone);
      
      if (productImage) {
        formDataToSend.append("productImage", productImage);
      }

      const response = await axios.post(
        "http://localhost:5000/api/marketing/generate",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setResults(response.data);
    } catch (error) {
      console.error("Error generating marketing content:", error);
      alert("Error generating content. Please check console and ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const downloadContent = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Error downloading image");
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      description: "",
      category: "",
      targetAudience: "",
      platform: "Instagram",
      tone: "Professional"
    });
    setProductImage(null);
    setImagePreview("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            AI Marketing Generator
          </h1>
          <p className="text-gray-600 text-xl">
            Create professional marketing copy and social media images instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">📝</span>
              Product Details
            </h2>

            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., EcoBottle Pro"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product's features and benefits..."
                  rows="4"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="e.g., Young professionals, fitness enthusiasts"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>

              {/* Platform and Tone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    {platforms.map(plat => (
                      <option key={plat} value={plat}>{plat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    {tones.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => {
                          setProductImage(null);
                          setImagePreview("");
                        }}
                        className="mt-3 text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-600 mb-2">Click to upload product image</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateMarketing}
                disabled={loading || !formData.productName || !formData.description}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "🚀 Generate Marketing Assets"
                )}
              </button>

              {results && (
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  🔄 Start Over
                </button>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Creating Your Marketing Assets</h3>
                <p className="text-gray-600">This may take 15-30 seconds...</p>
              </div>
            )}

            {results && (
              <>
                {/* Marketing Copy */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                      <span className="mr-3 text-3xl">✍️</span>
                      Marketing Copy
                    </h3>
                    <button
                      onClick={() => downloadContent(results.marketingCopy, `${formData.productName}_copy.txt`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                    >
                      📥 Download
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {results.marketingCopy}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {formData.platform}
                    </span>
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {formData.tone}
                    </span>
                    {formData.category && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {formData.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Generated Image */}
                {results.generatedImage && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="mr-3 text-3xl">🎨</span>
                        Social Media Banner
                      </h3>
                      <button
                        onClick={() => downloadImage(results.generatedImage, `${formData.productName}_banner.png`)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
                      >
                        📥 Download
                      </button>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                      <img
                        src={results.generatedImage}
                        alt="Generated Marketing Banner"
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Success Message */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-xl font-bold mb-1">Marketing Assets Ready!</h3>
                  <p className="text-green-100">Download and use them across your marketing channels</p>
                </div>
              </>
            )}

            {!loading && !results && (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Generate</h3>
                <p className="text-gray-600">Fill in the product details and click generate to create professional marketing content</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Powered by Claude AI & DALL-E 3 • Marketing automation made simple</p>
        </div>
      </div>
    </div>
  );
}

export default MarketingGenerator;