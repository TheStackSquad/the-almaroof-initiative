// src/components/news/newsGrid.js
import { useStaggerAnimation, useFadeIn } from "../../animation/aboutAnimate";
import NewsCard from "./newsCard";

const NewsGrid = ({ articles = [] }) => {
  const [gridRef, visibleItems] = useStaggerAnimation(articles.length, 200);
  const [titleRef, titleVisible] = useFadeIn(100);

  // Sample articles data if none provided
  const sampleArticles = [
    {
      id: 1,
      title: "Revolutionary AI Technology Transforms Healthcare Industry",
      excerpt:
        "Breakthrough artificial intelligence systems are revolutionizing patient care and medical diagnostics across global healthcare networks.",
      category: "Technology",
      date: "July 30, 2025",
      readTime: 5,
      image: "/api/placeholder/400/224",
      author: {
        name: "Dr. Sarah Chen",
        avatar: "/api/placeholder/32/32",
      },
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions Reach New Milestones",
      excerpt:
        "Solar and wind energy installations achieve record-breaking efficiency rates, marking a significant step toward global sustainability goals.",
      category: "Environment",
      date: "July 29, 2025",
      readTime: 7,
      image: "/api/placeholder/400/224",
      author: {
        name: "Michael Torres",
        avatar: "/api/placeholder/32/32",
      },
    },
    {
      id: 3,
      title: "Space Exploration Enters New Era with Mars Mission",
      excerpt:
        "International space consortium announces successful launch of advanced Mars exploration mission with cutting-edge research capabilities.",
      category: "Science",
      date: "July 28, 2025",
      readTime: 6,
      image: "/api/placeholder/400/224",
      author: {
        name: "Emma Rodriguez",
        avatar: "/api/placeholder/32/32",
      },
    },
    {
      id: 4,
      title: "Global Climate Summit Yields Promising Results",
      excerpt:
        "World leaders unite on comprehensive climate action plan, setting ambitious targets for carbon neutrality and environmental restoration.",
      category: "Politics",
      date: "July 27, 2025",
      readTime: 8,
      image: "/api/placeholder/400/224",
      author: {
        name: "James Wilson",
        avatar: "/api/placeholder/32/32",
      },
    },
    {
      id: 5,
      title: "Quantum Computing Breakthrough Reshapes Technology",
      excerpt:
        "Scientists achieve quantum supremacy in practical applications, opening new possibilities for cryptography and computational research.",
      category: "Technology",
      date: "July 26, 2025",
      readTime: 9,
      image: "/api/placeholder/400/224",
      author: {
        name: "Dr. Aisha Patel",
        avatar: "/api/placeholder/32/32",
      },
    },
    {
      id: 6,
      title: "Economic Markets Show Resilience Amid Global Changes",
      excerpt:
        "Financial analysts report stable growth patterns and innovative investment strategies driving market confidence worldwide.",
      category: "Business",
      date: "July 25, 2025",
      readTime: 4,
      image: "/api/placeholder/400/224",
      author: {
        name: "Robert Kim",
        avatar: "/api/placeholder/32/32",
      },
    },
  ];

  const displayArticles = articles.length > 0 ? articles : sampleArticles;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-800 ${
            titleVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Featured Stories
          </h2>
          <p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Discover the latest news, insights, and stories that are shaping our
            world today
          </p>
        </div>

        {/* News Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayArticles.map((article, index) => (
            <div
              key={article.id}
              className={`transition-all duration-500 ${
                index < visibleItems
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <NewsCard article={article} delay={index * 100} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
