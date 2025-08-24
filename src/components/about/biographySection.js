//src/app/about/biographySection.js

"use client";

import React from "react";
import { useSlideIn, useFadeIn } from "@/animation/aboutAnimate";
import Image from "next/image";

export default function BiographySection() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [contentRef, contentStyle] = useSlideIn("right", 400);
  const [imageRef, imageStyle] = useSlideIn("left", 600);

  return (
    <section ref={sectionRef} style={sectionStyle} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            About Otunba Kehinde Almaroof
          </h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div ref={imageRef} style={imageStyle} className="relative w-full">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500">
              {/* The parent of the image must have a defined height. */}
              <div className="relative w-full h-96 sm:h-[28rem] lg:h-[32rem] xl:h-[36rem]">
                <Image
                  src="/img/kendoo.webp"
                  alt="Official portrait of Otunba Kehinde Oloyode Almaroof"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 40vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                  className="aspect-[4/5]"
                  priority={true} // Since this is likely above the fold
                  quality={90} // Higher quality for portrait images
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli6FfVa4W7rkDQ1HdwwUBIC8tJJr+/6EvZlhqPY5/mLtGBpx9+ggAMhkkm2GcW7qw+FoVhNL7zGu/lqN7+0HHwEQaFjc3CqBgE7adWIXlbvUAHYbN1+kKqOxMoBnzexIWFE+3j9FeqiGJJdYpU+CfB3GNJvdSq/R++qWAbqgAuGfkMJE1aGhXGUzqrDaGgDCiPzNKOExJl1hqy6UWD+zzjGwADyb+8RKZHv/2Q=="
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-emerald-300 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border-4 border-teal-300 rounded-full opacity-40"></div>
            </div>
          </div>
          {/* Content Section */}
          <div ref={contentRef} style={contentStyle} className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-lg">
              <h3
                className="text-2xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Leadership Excellence
              </h3>
              <p
                className="text-gray-700 leading-relaxed mb-6"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Otunba Kehinde Oloyode Almaroof stands as a distinguished leader
                in Lagos State politics, having recently secured victory in the
                2025 Lagos Local Government Election as the Executive Chairman
                of Oshodi-Isolo Local Government Area.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h4
                    className="font-bold text-emerald-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Current Position
                  </h4>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    Executive Chairman, Oshodi-Isolo LGA
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h4
                    className="font-bold text-teal-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Election Victory
                  </h4>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    2025 Lagos LG Elections
                  </p>
                </div>
              </div>

              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Known for his active engagement with the community and strong
                social media presence, Otunba Almaroof has built a reputation as
                an accessible and responsive leader who prioritizes direct
                communication with the people of Oshodi-Isolo.
              </p>
            </div>

            {/* Key Highlights */}
            <div className="space-y-4">
              <h3
                className="text-xl font-bold text-gray-800"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Key Highlights
              </h3>

              <div className="space-y-3">
                {[
                  "Victorious in 2025 Lagos Local Government Elections",
                  "Active community engagement and grassroots leadership",
                  "Strong digital presence connecting with constituents",
                  "Commitment to transparent and accessible governance",
                ].map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300"></div>
                    <p
                      className="text-gray-700 group-hover:text-emerald-700 transition-colors duration-300"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}