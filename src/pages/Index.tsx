import { useState } from 'react';
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DemoSection from "@/components/DemoSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <header className="border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Smart Mic AI</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>
        <Dashboard />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Smart Mic AI</h1>
            <Button onClick={() => setShowAuthModal(true)}>
              Get Started
            </Button>
          </div>
        </header>
        
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <CTASection />
        <Footer />
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Index;
