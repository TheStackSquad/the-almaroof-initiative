// src/components/news/newsHero.js
import { useFadeIn, useSlideIn } from "../../animation/aboutAnimate";

const NewsHero = () => {
  const [heroRef, heroVisible] = useFadeIn(200);
  const [titleRef, titleStyle] = useSlideIn("up", 400);
  const [subtitleRef, subtitleStyle] = useSlideIn("up", 600);

  return (
    <section
      ref={heroRef}
      className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden transition-all duration-500 ${
        heroVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-300 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div ref={titleRef} style={titleStyle}>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Latest News
          </h1>
        </div>

        <div ref={subtitleRef} style={subtitleStyle}>
          <p
            className="text-xl md:text-2xl opacity-90 leading-relaxed"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Stay updated with the latest developments, insights, and stories
            that matter
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsHero;
