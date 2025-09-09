import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Smartphone, MessageSquare, Users, Zap, Globe } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-glow/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Mic & AI-Powered
              <span className="block gradient-primary bg-clip-text text-transparent">
                Audience Interaction
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionize your events with QR-based smart microphones, AI voice generation, 
              real-time translation, and intelligent question clustering for seamless audience engagement.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <Zap className="mr-2 h-5 w-5" />
              Experience Demo
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Users className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Card className="p-8 gradient-card shadow-card border-0 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">QR Smart Access</h3>
                <p className="text-muted-foreground">
                  Scan seat QR codes to instantly request microphone access and participate in discussions.
                </p>
              </div>
            </Card>

            <Card className="p-8 gradient-card shadow-card border-0 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Voice Assistant</h3>
                <p className="text-muted-foreground">
                  Type your questions and let AI speak for you with customizable voice options.
                </p>
              </div>
            </Card>

            <Card className="p-8 gradient-card shadow-card border-0 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Translation</h3>
                <p className="text-muted-foreground">
                  Break language barriers with instant multi-language translation for all participants.
                </p>
              </div>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/70">Events Powered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">25</div>
              <div className="text-white/70">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/70">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;