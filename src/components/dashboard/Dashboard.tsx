import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, Calendar, QrCode, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { VoiceChat } from '@/components/voice/VoiceChat';
import { QRCodeGenerator } from '@/components/qr/QRCodeGenerator';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string | null;
  max_participants: number | null;
  status: string | null;
  moderator_id: string;
  created_at: string | null;
}

interface Question {
  id: string;
  content: string;
  status: string | null;
  created_at: string | null;
  profiles: {
    full_name: string | null;
  } | null;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(50);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedEvent) {
      fetchQuestions();
      
      // Subscribe to real-time question updates
      const subscription = supabase
        .channel(`questions:${selectedEvent.id}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'questions',
            filter: `event_id=eq.${selectedEvent.id}`
          },
          () => {
            fetchQuestions();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('moderator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
      if (data && data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!selectedEvent) return;

    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('event_id', selectedEvent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEventName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: newEventName.trim(),
          description: newEventDescription.trim() || null,
          moderator_id: user.id,
          max_participants: maxParticipants,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [data, ...prev]);
      setSelectedEvent(data);
      setNewEventName('');
      setNewEventDescription('');
      setMaxParticipants(50);
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      toast.success('Question deleted');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const updateQuestionStatus = async (questionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ status })
        .eq('id', questionId);

      if (error) throw error;
      
      fetchQuestions();
      toast.success(`Question marked as ${status}`);
    } catch (error) {
      console.error('Error updating question status:', error);
      toast.error('Failed to update question');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Event Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span className="font-medium">{events.length} Events</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    placeholder="My Q&A Session"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Description</Label>
                  <Input
                    id="eventDescription"
                    placeholder="Optional description"
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min={1}
                    max={1000}
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedEvent?.id === event.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm opacity-75">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <p className="text-muted-foreground text-sm">No events yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedEvent ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="voice">AI Voice</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedEvent.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant="default">{selectedEvent.status}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Participants</p>
                        <p className="font-medium">{selectedEvent.max_participants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {new Date(selectedEvent.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Questions</p>
                        <p className="font-medium">{questions.length}</p>
                      </div>
                    </div>
                    
                    {selectedEvent.description && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{selectedEvent.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="questions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Questions ({questions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{question.content}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <p className="text-sm text-muted-foreground">
                                  by {question.profiles?.full_name || 'Anonymous'}
                                </p>
                                <Badge 
                                  variant={
                                    question.status === 'answered' ? 'default' : 
                                    question.status === 'pending' ? 'secondary' : 'outline'
                                  }
                                >
                                  {question.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {question.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateQuestionStatus(question.id, 'answered')}
                                >
                                  Mark Answered
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {questions.length === 0 && (
                        <div className="text-center py-8">
                          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground mt-2">No questions yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="voice">
                <VoiceChat eventId={selectedEvent.id} isHost={true} />
              </TabsContent>
              
              <TabsContent value="qr">
                <QRCodeGenerator eventId={selectedEvent.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No event selected</h3>
                <p className="text-muted-foreground">
                  Create your first event to get started with Smart Mic AI
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};