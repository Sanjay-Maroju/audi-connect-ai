import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceChatProps {
  eventId: string;
  isHost?: boolean;
}

export const VoiceChat = ({ eventId, isHost = false }: VoiceChatProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { user } = useAuth();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const finalTranscript = lastResult[0].transcript;
          setTranscript(finalTranscript);
          handleSendQuestion(finalTranscript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition failed. Please try again.');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [eventId]);

  const startListening = async () => {
    if (!user) {
      toast.error('Please sign in to ask questions');
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSendQuestion = async (questionText: string) => {
    if (!user || !questionText.trim()) return;

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
        .from('questions')
        .insert({
          event_id: eventId,
          participant_id: profile.id,
          content: questionText.trim(),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Question submitted successfully!');
      
      // If host, generate AI response
      if (isHost) {
        generateAIResponse(questionText);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    }
  };

  const generateAIResponse = async (question: string) => {
    try {
      setIsPlaying(true);
      
      const { data, error } = await supabase.functions.invoke('generate-voice-response', {
        body: {
          question,
          eventId,
          voice: 'alloy' // ElevenLabs voice ID
        }
      });

      if (error) throw error;

      // Play the audio response
      if (data.audioContent && audioEnabled) {
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mp3' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate response');
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isHost ? 'AI Voice Assistant' : 'Ask Your Question'}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAudio}
          className="p-2"
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      {transcript && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Last recognized:</p>
          <p className="font-medium">{transcript}</p>
        </div>
      )}

      <div className="flex items-center justify-center">
        <Button
          variant={isListening ? "destructive" : "default"}
          size="lg"
          onClick={isListening ? stopListening : startListening}
          disabled={isPlaying}
          className="w-full max-w-xs h-16 text-lg"
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Stop Listening
            </>
          ) : isPlaying ? (
            <>
              <Volume2 className="mr-2 h-5 w-5 animate-pulse" />
              AI Responding...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              {isHost ? 'Listen for Questions' : 'Ask Question'}
            </>
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {isHost 
          ? 'Click to listen for audience questions and provide AI-powered responses'
          : 'Click and speak your question. AI will provide an instant response.'
        }
      </p>
    </Card>
  );
};