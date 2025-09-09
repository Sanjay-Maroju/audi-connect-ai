import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Globe
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smart Mic AI</span>
            </div>
            <p className="text-muted-foreground">
              Revolutionizing audience interaction with AI-powered smart microphone systems 
              for events, conferences, and educational institutions.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Solutions</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Conferences</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Educational Institutions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Corporate Events</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Town Halls</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Webinars</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">QR Code Access</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Voice Assistant</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Real-time Translation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Question Clustering</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics Dashboard</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>hello@smartmic.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4" />
                <span>25+ Languages Supported</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            © {currentYear} Smart Mic AI. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;