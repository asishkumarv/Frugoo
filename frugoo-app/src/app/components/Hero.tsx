import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const fruitsVideo = "/assets/fruits.mp4";


interface SlideContent {
  video: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: SlideContent[] = [
  {
    video: fruitsVideo,
    title: "Fresh Fruits,",
    subtitle: "Naturally Delicious",
    description: "Farm-fresh fruits delivered to your doorstep. Experience nature's sweetness perfectly picked and delivered just for you."
  },
  {
    video: fruitsVideo,
    title: "Premium Quality,",
    subtitle: "Unbeatable Freshness",
    description: "Handpicked from the finest farms. Every fruit is carefully selected to ensure maximum flavor and nutritional value."
  },
  {
    video: fruitsVideo,
    title: "Healthy Living,",
    subtitle: "Made Simple",
    description: "Start your wellness journey with our fresh, organic fruits. Delivered daily to support your healthy lifestyle."
  }
];

export function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: false,
    arrows: true,
  };

  return (
    <section className="relative h-[450px] md:h-[500px] overflow-hidden">
      <Slider {...settings} className="hero-carousel h-full">
        {slides.map((slide, index) => (
          <div key={index}>
            <div className="relative h-[450px] md:h-[500px] overflow-hidden bg-green-900">
              {/* Video Background */}
              <div className="absolute inset-0 w-full h-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'brightness(0.7)' }}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
              </div>

              {/* Content */}
              <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
                <div className="max-w-3xl text-white">
                  <motion.h1
                    className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {slide.title}
                    <br />
                    <span className="text-green-300">{slide.subtitle}</span>
                  </motion.h1>
                  <motion.p
                    className="text-base md:text-lg mb-6 max-w-xl text-white drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div
                    className="flex flex-wrap gap-3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  >
                    <Link to="/shop">
                      <Button size="lg" className="bg-green-600 hover:bg-green-700 h-12 px-8 text-base font-semibold text-white shadow-2xl hover:shadow-green-500/50 transition-all">
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button
                        size="lg"
                        className="h-12 px-8 text-base font-semibold border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-green-700 transition-all shadow-2xl"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        .hero-carousel .slick-dots {
          bottom: 20px;
        }
        .hero-carousel .slick-dots li button:before {
          color: white;
          opacity: 0.5;
          font-size: 12px;
        }
        .hero-carousel .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #4ade80;
        }
        .hero-carousel .slick-prev,
        .hero-carousel .slick-next {
          z-index: 30;
          width: 40px;
          height: 40px;
        }
        .hero-carousel .slick-prev {
          left: 20px;
        }
        .hero-carousel .slick-next {
          right: 20px;
        }
        .hero-carousel .slick-prev:before,
        .hero-carousel .slick-next:before {
          font-size: 40px;
          opacity: 0.7;
        }
        .hero-carousel .slick-prev:hover:before,
        .hero-carousel .slick-next:hover:before {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}