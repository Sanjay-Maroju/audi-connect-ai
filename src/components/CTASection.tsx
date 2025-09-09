import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Mail, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

const CTASection = () => {
  const benefits = [
    "50% increase in audience participation",
    "Real-time multi-language support",
    "AI-powered question management",
    "Zero hardware installation required",
    "24/7 technical support included"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <Badge variant="outline" className="mb-6 border-white/30 text-white">
                <Star className="mr-2 h-4 w-4" />
                Trusted by 500+ Organizations
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to Transform Your
                <span className="block text-primary-glow">Event Experience?</span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join hundreds of event organizers who've revolutionized their audience 
                engagement with our Smart Mic AI system. No hardware required - just scan and speak.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-glow flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-glow"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <Card className="p-8 gradient-card shadow-elegant border-0 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Get Started Today</h3>
                <p className="text-muted-foreground">
                  Request a personalized demo for your next event
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="John" className="shadow-card" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Doe" className="shadow-card" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" placeholder="john@company.com" className="shadow-card" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Organization</label>
                  <Input placeholder="Your Company Name" className="shadow-card" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Type</label>
                  <Input placeholder="Conference, Classroom, Meeting..." className="shadow-card" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Audience Size</label>
                  <Input placeholder="50-100, 100-500, 500+" className="shadow-card" />
                </div>

                <Button variant="default" size="lg" className="w-full shadow-elegant">
                  <Mail className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our terms of service and privacy policy.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;