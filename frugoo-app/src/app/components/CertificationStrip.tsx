import cert1 from "../../imports/1.png";
import cert2 from "../../imports/2.png";
import cert3 from "../../imports/3.png";
import cert4 from "../../imports/4.png";
import cert5 from "../../imports/5.png";
import cert6 from "../../imports/6.png";
import cert7 from "../../imports/7.png";
import cert8 from "../../imports/8.png";
import cert9 from "../../imports/9.png";

export function CertificationStrip() {
  const certifications = [
    { name: "Certification 1", image: cert1 },
    { name: "Certification 2", image: cert2 },
    { name: "Certification 3", image: cert3 },
    { name: "Certification 4", image: cert4 },
    { name: "Certification 5", image: cert5 },
    { name: "Certification 6", image: cert6 },
    { name: "Certification 7", image: cert7 },
    { name: "Certification 8", image: cert8 },
    { name: "Certification 9", image: cert9 },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Trusted & Certified Quality
          </h2>
          <p className="text-gray-600">Our certifications ensure the highest standards of food safety and quality</p>
        </div>

        <div className="relative">
          <div className="flex animate-scroll-continuous gap-4 md:gap-6">
            {/* Duplicate certifications for seamless infinite loop */}
            {[...Array(3)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-4 md:gap-6">
                {certifications.map((cert, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="flex-shrink-0 group cursor-pointer"
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-2 md:p-3 flex items-center justify-center h-20 md:h-28 w-auto">
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="h-full w-auto object-contain max-w-[160px] md:max-w-[200px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-continuous {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-scroll-continuous {
          animation: scroll-continuous 18s linear infinite;
          will-change: transform;
        }

        @media (hover: hover) {
          .animate-scroll-continuous:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
    </section>
  );
}