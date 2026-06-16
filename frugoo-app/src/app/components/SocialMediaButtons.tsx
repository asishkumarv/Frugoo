import { Facebook, Instagram, Linkedin, Twitter, MessageCircle } from "lucide-react";

export function SocialMediaButtons() {
  const socialLinks = {
    facebook: "https://facebook.com/frugoo",
    instagram: "https://instagram.com/frugoo",
    linkedin: "https://linkedin.com/company/frugoo",
    twitter: "https://twitter.com/frugoo"
  };

  const whatsappMessage = "Hi! I'm interested in ordering fresh fruits from Frugoo.";
  const whatsappNumber = "919876543210"; // Replace with actual number
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
      {/* Social Media Icons */}
      <div className="flex flex-col gap-3 bg-white rounded-full shadow-lg p-3 border">
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        {/* <a
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Twitter"
        >
          <Twitter className="h-5 w-5" />
        </a> */}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}