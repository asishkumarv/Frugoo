import { Card } from "../components/ui/card";
import { Heart, Leaf, Users, Award, User } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-lime-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-900">
              About Frugoo
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              We're passionate about bringing farm-fresh, naturally delicious fruits directly to your doorstep. 
              Our journey began with a simple mission: to make healthy eating accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1657288649124-b80bdee3c17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZyZXNoJTIwcHJvZHVjZXxlbnwxfHx8fDE3NzI2ODgxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fresh produce farm"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2020, Frugoo started as a small family business with a big dream. 
                  We wanted to bridge the gap between local farmers and health-conscious consumers, 
                  ensuring that everyone has access to the freshest, most delicious fruits available.
                </p>
                <p>
                  Today, we partner with over 50 local farms and serve thousands of happy customers 
                  every day. Our commitment to quality, sustainability, and customer satisfaction 
                  remains at the heart of everything we do.
                </p>
                <p>
                  Every fruit in our selection is carefully hand-picked at peak ripeness, ensuring 
                  maximum flavor and nutritional value. We believe that healthy eating should be 
                  convenient, affordable, and absolutely delicious.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Frugoo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We're committed to eco-friendly practices and supporting sustainable farming methods
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality First</h3>
              <p className="text-gray-600 text-sm">
                Only the finest, freshest fruits make it to our customers. Quality is never compromised
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600 text-sm">
                We support local farmers and build strong relationships with our community
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600 text-sm">
                We strive for excellence in everything we do, from sourcing to delivery
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Frugoo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-10">
            <Card className="relative overflow-visible hover:shadow-xl transition-shadow duration-300 text-center p-8 pt-12">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-[3px] border-green-600 flex items-center justify-center shadow-sm">
                <User className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">R Krishna Chaitanya</h3>
              <p className="text-green-600 text-sm font-bold tracking-wider uppercase">Founder</p>
            </Card>

            <Card className="relative overflow-visible hover:shadow-xl transition-shadow duration-300 text-center p-8 pt-12">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-[3px] border-green-600 flex items-center justify-center shadow-sm">
                <User className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">E. Haritha Reddy</h3>
              <p className="text-green-600 text-sm font-bold tracking-wider uppercase">Co-Founder</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-green-100">Partner Farms</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-green-100">Organic Options</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
