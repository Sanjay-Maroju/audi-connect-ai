import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Calendar } from 'lucide-react';
import { VoiceChat } from '@/components/voice/VoiceChat';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  max_participants: number | null;
  profiles: {
    full_name: string | null;
  } | null;
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

export const ParticipantPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchQuestions();
      
      // Subscribe to real-time question updates
      const subscription = supabase
        .channel(`questions:${eventId}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'questions',
            filter: `event_id=eq.${eventId}`
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
  }, [eventId]);

  useEffect(() => {
    if (user && eventId && event) {
      checkParticipation();
    }
  }, [user, eventId, event]);

  const fetchEvent = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('event_id', eventId)
        .eq('status', 'answered')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const checkParticipation = async () => {
    if (!user || !eventId) return;

    try {
      // Get user's profile id first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('participant_id', profile.id)
        .single();

      if (data) {
        setHasJoined(true);
      }
    } catch (error) {
      // User hasn't joined yet
      setHasJoined(false);
    }
  };

  const joinEvent = async () => {
    if (!user || !eventId || !event) {
      setShowAuthModal(true);
      return;
    }

    try {
        // Get user's profile id first
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!profile) {
          toast.error('Profile not found');
          return;
        }

        const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          participant_id: profile.id
        });

      if (error) throw error;
      
      setHasJoined(true);
      toast.success(`Joined "${event.title}" successfully!`);
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-destructive">Event Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The event you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {event.description}
            </p>
          )}
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="default">{event.status}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              Max {event.max_participants} participants
            </div>
          </div>
        </div>

        {event.status !== 'active' ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Event Not Active</h3>
              <p className="text-muted-foreground">
                This event is not currently accepting questions.
              </p>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8 space-y-4">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Join the Event</h3>
                <p className="text-muted-foreground">
                  Sign in to participate and ask questions using voice commands.
                </p>
              </div>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Sign In to Participate
              </Button>
            </CardContent>
          </Card>
        ) : !hasJoined ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8 space-y-4">
              <MessageSquare className="mx-auto h-12 w-12 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Ready to Join?</h3>
                <p className="text-muted-foreground">
                  Join this event to start asking questions with AI-powered voice responses.
                </p>
              </div>
              <Button onClick={joinEvent} className="w-full">
                Join Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <VoiceChat eventId={eventId!} isHost={false} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Recent Q&A ({questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((question) => (
                    <div key={question.id} className="border-l-2 border-primary pl-4">
                      <p className="font-medium text-sm">{question.content}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          by {question.profiles?.full_name || 'Anonymous'}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Answered
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {questions.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm mt-2">
                        No questions answered yet. Be the first to ask!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            Hosted by {event.profiles?.full_name || 'Anonymous'} • 
            Powered by Smart Mic AI
          </p>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};