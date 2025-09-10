import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  eventId: string;
}

export const QRCodeGenerator = ({ eventId }: QRCodeGeneratorProps) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const participantUrl = `${window.location.origin}/participate/${eventId}`;

  useEffect(() => {
    generateQRCode();
  }, [eventId]);

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, participantUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      });

      const dataUrl = canvas.toDataURL();
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `smart-mic-ai-event-${eventId}.png`;
    link.href = qrDataUrl;
    link.click();
    
    toast.success('QR code downloaded!');
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(participantUrl);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Smart Mic AI Event',
          text: 'Join this interactive Q&A session with AI-powered responses!',
          url: participantUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyUrl();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5" />
          Event QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
            <canvas 
              ref={canvasRef} 
              className="block"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Participants can scan this QR code or visit the URL below to join your event and ask questions using voice commands.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-mono break-all">{participantUrl}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadQRCode} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            
            <Button onClick={copyUrl} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            
            <Button onClick={shareUrl} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">How to use:</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Share the QR code or URL with your audience</li>
            <li>2. Participants scan the code or visit the link</li>
            <li>3. They can ask questions using voice commands</li>
            <li>4. AI provides instant responses with voice synthesis</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};