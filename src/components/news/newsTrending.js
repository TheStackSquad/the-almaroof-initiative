// src/components/news/newsTrending.js
import { useSlideIn, useStaggerAnimation } from "../../animation/aboutAnimate";
import Image from "next/image";

const NewsTrending = () => {
  const [titleRef, titleStyle] = useSlideIn("up", 200);
  const [listRef, visibleItems] = useStaggerAnimation(5, 150);

  const trendingNews = [
    {
      id: 1,
      title: "Oshodi-Isolo LG Chairman Commissions New Road, Borehole Projects",
      category: "Community Development",
      readTime: "3 min",
      trend: "✨ Local Buzz",
      image: "/img/road.jpg",
    },
    {
      id: 2,
      title: "Oshodi Market Traders Protest New Sanitation Regulations",
      category: "Local Business",
      readTime: "5 min",
      trend: "⚠️ Hot Topic",
      image: "/img/market.jpg",
    },
    {
      id: 3,
      title:
        "Neighborhood Watch Groups Call for Increased Security Patrols in Mafoluku",
      category: "Security",
      readTime: "4 min",
      trend: "🚨 Rising Concerns",
      image: "/images/sec.jpg",
    },
    {
      id: 4,
      title:
        "Youths in Oshodi Participate in Vocational Skills Training Program",
      category: "Empowerment",
      readTime: "6 min",
      trend: "💪 Making Moves",
      image: "/img/vocational-1.jpg",
    },
    {
      id: 5,
      title: "Community Outreach Provides Food Relief to Elderly in Oshodi",
      category: "Social",
      readTime: "2 min",
      trend: "❤️ Viral Kindness",
      image: "/img/food.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
           {" "}
      <div className="max-w-7xl mx-auto px-6">
               {" "}
        <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side - Title and Description */}         {" "}
          <div className="lg:w-1/3">
                       {" "}
            <div ref={titleRef} style={titleStyle}>
                           {" "}
              <div className="flex items-center mb-4">
                               {" "}
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                                   {" "}
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                                     {" "}
                  </svg>
                                 {" "}
                </div>
                               {" "}
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm font-semibold rounded-full">
                                    TRENDING NOW                {" "}
                </span>
                             {" "}
              </div>
                           {" "}
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                                What&apos;s Hot Right Now              {" "}
              </h2>
                           {" "}
              <p
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                                Stay ahead of the curve with the most popular
                and rapidly                 growing stories across all
                categories.              {" "}
              </p>
                           {" "}
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                               {" "}
                <div className="flex items-center">
                                   {" "}
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    <span>Live Updates</span>               {" "}
                </div>
                               {" "}
                <div className="flex items-center">
                                   {" "}
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> 
                                  <span>Real-time Trends</span>               {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                    {/* Right Side - Trending List */}         {" "}
          <div className="lg:w-2/3">
                       {" "}
            <div ref={listRef} className="space-y-4">
                           {" "}
              {trendingNews.map((news, index) => (
                <article
                  key={news.id}
                  className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700 ${
                    index < visibleItems
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                >
                                     {" "}
                  {/* This div creates a flex container for the card content */}
                                   {" "}
                  <div className="flex items-start">
                                       {" "}
                    {/* Image container - fixed size and rounded */}           
                           {" "}
                    <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-xl mr-6">
                                           {" "}
                      <Image
                        src={news.image}
                        fill
                        style={{ objectFit: "cover" }}
                        alt={news.title}
                        className="transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                                         {" "}
                    </div>
                                        {/* Content and details */}             
                         {" "}
                    <div className="flex-1 min-w-0">
                                           {" "}
                      <div className="flex items-center mb-2">
                                               {" "}
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold rounded-full mr-3">
                                                    {news.category}             
                                   {" "}
                        </span>
                                               {" "}
                        <span
                          className="text-xs text-gray-500 dark:text-gray-400"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                                                    {news.readTime} read        
                                         {" "}
                        </span>
                                             {" "}
                      </div>
                                           {" "}
                      <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                                                {news.title}                   
                         {" "}
                      </h3>
                                         {" "}
                    </div>
                                       {" "}
                    {/* This div is for the trend and arrow, ensuring they align right */}
                                       {" "}
                    <div className="flex-shrink-0 ml-4 flex flex-col items-end">
                                            {/* Trend Indicator */}             
                             {" "}
                      <div className="px-3 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 text-orange-600 dark:text-orange-300 rounded-xl text-sm font-semibold mb-2">
                                                {news.trend}                   
                         {" "}
                      </div>
                                            {/* Arrow */}                     {" "}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                               {" "}
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                                                   {" "}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                                                 {" "}
                        </svg>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                 {" "}
                </article>
              ))}
                         {" "}
            </div>
                        {/* View All Trending Button */}           {" "}
            <div className="mt-8 text-center">
                           {" "}
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                View All Trending Stories                {" "}
                <svg
                  className="w-4 h-4 ml-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                                 {" "}
                </svg>
                             {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </section>
  );
};

export default NewsTrending;
