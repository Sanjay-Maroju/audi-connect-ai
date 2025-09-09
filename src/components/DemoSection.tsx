import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, 
  Hand, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Users,
  Send,
  Check,
  Clock,
  X
} from "lucide-react";

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState("audience");
  const [handRaised, setHandRaised] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(false);

  const mockQuestions = [
    { id: 1, user: "Seat A-15", question: "How does the AI clustering algorithm work?", status: "pending" },
    { id: 2, user: "Seat B-22", question: "What about data privacy and security?", status: "approved" },
    { id: 3, user: "Seat C-8", question: "Can this integrate with existing conference systems?", status: "speaking" },
  ];

  const mockParticipants = [
    { id: 1, seat: "A-15", name: "Anonymous", status: "hand-raised" },
    { id: 2, seat: "B-22", name: "Anonymous", status: "approved" },
    { id: 3, seat: "C-8", name: "Anonymous", status: "speaking" },
    { id: 4, seat: "D-12", name: "Anonymous", status: "idle" },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience the
            <span className="gradient-primary bg-clip-text text-transparent"> Smart Mic System</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Try our interactive demo to see how seamlessly audiences can participate in events
          </p>
        </div>

        {/* Demo Interface */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="audience" className="text-lg py-3">
                <Users className="mr-2 h-5 w-5" />
                Audience View
              </TabsTrigger>
              <TabsTrigger value="moderator" className="text-lg py-3">
                <Users className="mr-2 h-5 w-5" />
                Moderator Dashboard
              </TabsTrigger>
            </TabsList>

            {/* Audience Interface */}
            <TabsContent value="audience" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Scanner Simulation */}
                <Card className="p-8 gradient-card shadow-card border-0">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-4">Step 1: Scan Your Seat QR</h3>
                    <div className="w-32 h-32 mx-auto mb-4 bg-foreground/10 rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-foreground/60" />
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      Seat A-15 Detected
                    </Badge>
                  </div>
                </Card>

                {/* Participation Controls */}
                <Card className="p-8 gradient-card shadow-card border-0">
                  <h3 className="text-2xl font-bold mb-6">Step 2: Participate</h3>
                  
                  <div className="space-y-4">
                    {/* Raise Hand */}
                    <Button
                      variant={handRaised ? "success" : "outline"}
                      size="lg"
                      className="w-full"
                      onClick={() => setHandRaised(!handRaised)}
                    >
                      <Hand className="mr-2 h-5 w-5" />
                      {handRaised ? "Hand Raised" : "Raise Hand"}
                    </Button>

                    {/* Microphone Status */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <span className="font-medium">Microphone Access</span>
                      <Badge variant={micActive ? "success" : "outline"}>
                        {micActive ? (
                          <>
                            <Mic className="mr-1 h-4 w-4" />
                            Active
                          </>
                        ) : (
                          <>
                            <MicOff className="mr-1 h-4 w-4" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              {/* AI Voice Feature */}
              <Card className="p-8 gradient-card shadow-card border-0">
                <h3 className="text-2xl font-bold mb-6">AI Voice Assistant</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-medium">Type your question (AI will speak for you)</label>
                    <Button
                      variant={aiVoiceEnabled ? "success" : "outline"}
                      size="sm"
                      onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}
                    >
                      {aiVoiceEnabled ? (
                        <>
                          <Volume2 className="mr-2 h-4 w-4" />
                          AI Voice On
                        </>
                      ) : (
                        <>
                          <VolumeX className="mr-2 h-4 w-4" />
                          AI Voice Off
                        </>
                      )}
                    </Button>
                  </div>

                  <Textarea
                    placeholder="Type your question here and our AI will read it aloud for you..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="min-h-32"
                  />

                  <div className="flex gap-4">
                    <Button variant="default" size="lg" className="flex-1">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Question
                    </Button>
                    <Button variant="outline" size="lg">
                      <Volume2 className="mr-2 h-4 w-4" />
                      Preview Voice
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Moderator Dashboard */}
            <TabsContent value="moderator" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Questions Queue */}
                <Card className="p-8 gradient-card shadow-card border-0">
                  <h3 className="text-2xl font-bold mb-6">Questions Queue</h3>
                  
                  <div className="space-y-4">
                    {mockQuestions.map((question) => (
                      <div key={question.id} className="p-4 bg-background/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{question.user}</Badge>
                          <Badge variant={
                            question.status === "speaking" ? "success" :
                            question.status === "approved" ? "default" : "outline"
                          }>
                            {question.status === "speaking" && <Mic className="mr-1 h-3 w-3" />}
                            {question.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{question.question}</p>
                        
                        {question.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="success">
                              <Check className="mr-1 h-3 w-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              Queue
                            </Button>
                            <Button size="sm" variant="destructive">
                              <X className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Participant Management */}
                <Card className="p-8 gradient-card shadow-card border-0">
                  <h3 className="text-2xl font-bold mb-6">Active Participants</h3>
                  
                  <div className="space-y-4">
                    {mockParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                        <div>
                          <div className="font-medium">{participant.seat}</div>
                          <div className="text-sm text-muted-foreground">{participant.name}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            participant.status === "speaking" ? "success" :
                            participant.status === "approved" ? "default" :
                            participant.status === "hand-raised" ? "warning" : "outline"
                          }>
                            {participant.status === "speaking" && <Mic className="mr-1 h-3 w-3" />}
                            {participant.status === "hand-raised" && <Hand className="mr-1 h-3 w-3" />}
                            {participant.status}
                          </Badge>
                          
                          {participant.status !== "idle" && (
                            <Button size="sm" variant="outline">
                              Control
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Control Panel */}
              <Card className="p-8 gradient-card shadow-card border-0">
                <h3 className="text-2xl font-bold mb-6">Session Controls</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="success" size="lg">
                    <Mic className="mr-2 h-4 w-4" />
                    Enable All Mics
                  </Button>
                  <Button variant="destructive" size="lg">
                    <MicOff className="mr-2 h-4 w-4" />
                    Mute All
                  </Button>
                  <Button variant="default" size="lg">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    AI Clustering
                  </Button>
                  <Button variant="outline" size="lg">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Translation
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;