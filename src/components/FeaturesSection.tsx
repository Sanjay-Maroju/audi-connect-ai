import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Smartphone, 
  MessageSquare, 
  Brain, 
  Globe, 
  Settings,
  Users,
  Shield,
  BarChart,
  Volume2
} from "lucide-react";
import qrScannerImage from "@/assets/qr-scanner.jpg";
import aiVoiceImage from "@/assets/ai-voice.jpg";
import dashboardImage from "@/assets/dashboard.jpg";

const FeaturesSection = () => {
  const features = [
    {
      icon: QrCode,
      title: "QR-Based Smart Mic Access",
      description: "Each seat gets a unique QR code. Attendees scan to identify their location and request microphone access instantly.",
      image: qrScannerImage,
      highlights: ["Unique seat identification", "Instant request system", "Mobile-first design"]
    },
    {
      icon: Volume2,
      title: "AI Voice for Shy Users",
      description: "Type your questions and let our AI speak for you with customizable voice options including tone, pitch, and speed.",
      image: aiVoiceImage,
      highlights: ["Customizable AI voices", "Preview before speaking", "Confidence building"]
    },
    {
      icon: Brain,
      title: "Intelligent Question Clustering",
      description: "AI groups questions by semantic similarity rather than text matching, identifying key themes and priorities.",
      image: dashboardImage,
      highlights: ["Semantic understanding", "Priority detection", "Theme identification"]
    }
  ];

  const additionalFeatures = [
    {
      icon: Globe,
      title: "Real-time Translation",
      description: "Multi-language support with instant translation for global audience participation."
    },
    {
      icon: Users,
      title: "Moderator Dashboard",
      description: "Complete control panel for managing participants, questions, and session flow."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption and privacy protection for sensitive discussions."
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      description: "Detailed participation metrics and engagement analytics for every session."
    },
    {
      icon: Settings,
      title: "Customizable Setup",
      description: "Flexible configuration options to match your specific event requirements."
    },
    {
      icon: MessageSquare,
      title: "Live Question Queue",
      description: "Real-time question collection and management with intelligent prioritization."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Revolutionary Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powered by Advanced
            <span className="gradient-primary bg-clip-text text-transparent"> AI Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Transform your events with cutting-edge features designed to maximize audience engagement 
            and streamline interaction management.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-24 mb-20">
          {features.map((feature, index) => (
            <div key={feature.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">{feature.title}</h3>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3 mb-8">
                  {feature.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-3">
                      <div className="w-2 h-2 gradient-primary rounded-full"></div>
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Button variant="default" size="lg">
                  Explore Feature
                </Button>
              </div>

              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <Card className="overflow-hidden shadow-card border-0">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-80 object-cover"
                  />
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Complete Solution</h3>
          <p className="text-lg text-muted-foreground">
            Everything you need for seamless audience interaction management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {additionalFeatures.map((feature) => (
            <Card key={feature.title} className="p-8 gradient-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;