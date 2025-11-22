"use client";
import { useMiniApp } from "@/contexts/miniapp-context";
import { sdk } from "@farcaster/frame-sdk";
import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { SelfVerify } from "@/components/self-verify";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { context, isMiniAppReady } = useMiniApp();
  const [isAddingMiniApp, setIsAddingMiniApp] = useState(false);
  const [addMiniAppMessage, setAddMiniAppMessage] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const router = useRouter();
  
  // Wallet connection hooks
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  
  // Auto-connect wallet when miniapp is ready
  useEffect(() => {
    if (isMiniAppReady && !isConnected && !isConnecting && connectors.length > 0) {
      const farcasterConnector = connectors.find(c => c.id === 'farcaster');
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isMiniAppReady, isConnected, isConnecting, connectors, connect]);
  
  // Extract user data from context
  const user = context?.user;
  // Use connected wallet address if available, otherwise fall back to user custody/verification
  const walletAddress = address || user?.custody || user?.verifications?.[0] || "0x1e4B...605B";
  const displayName = user?.displayName || user?.username || "User";
  const username = user?.username || "@user";
  const pfpUrl = user?.pfpUrl;
  
  // Format wallet address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  if (!isMiniAppReady) {
    return (
      <main className="flex-1">
        <section className="flex items-center justify-center min-h-screen bg-background">
          <div className="w-full max-w-md mx-auto p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </main>
    );
  }
  
  return (
    <main className="flex-1">
      <section className="flex items-center justify-center min-h-screen bg-background py-8">
        <div className="w-full max-w-md mx-auto px-6">
          {/* Profile Section */}
          <div className="text-center mb-8">
            {/* Profile Avatar */}
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              {pfpUrl ? (
                <img 
                  src={pfpUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {displayName}
              </h1>
              <p className="text-muted-foreground text-sm mb-3">
                {username.startsWith('@') ? username : `@${username}`}
              </p>
              
              {/* Wallet Address Chip */}
              <div className="inline-flex items-center gap-2 bg-card backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs text-foreground font-mono">
                  {formatAddress(walletAddress)}
                </span>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3 mb-6">
            {/* Verification Card */}
            <div className="bg-card backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Exclusive Content
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  You need Self verification to access {displayName}'s exclusive links and perks
                </p>
              </div>
              
              <Button
                onClick={() => setShowVerifyModal(true)}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-6 text-base shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verify with Self Protocol
              </Button>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p>
                    Self Protocol provides privacy-preserving identity verification. 
                    Your personal data stays on your device.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Miniapp Button */}
          <div className="mt-8">
            <button
              onClick={async () => {
                if (isAddingMiniApp) return;
                
                setIsAddingMiniApp(true);
                setAddMiniAppMessage(null);
                
                try {
                  const result = await sdk.actions.addMiniApp();
                  // @ts-ignore - SDK type might be incomplete
                  if (result?.added) {
                    setAddMiniAppMessage("✅ Miniapp added successfully!");
                  } else {
                    setAddMiniAppMessage("ℹ️ Miniapp was not added (user declined or already exists)");
                  }
                } catch (error: any) {
                  console.error('Add miniapp error:', error);
                  if (error?.message?.includes('domain')) {
                    setAddMiniAppMessage("⚠️ This miniapp can only be added from its official domain");
                  } else {
                    setAddMiniAppMessage("❌ Failed to add miniapp. Please try again.");
                  }
                } finally {
                  setIsAddingMiniApp(false);
                }
              }}
              disabled={isAddingMiniApp}
              className="w-full bg-card hover:bg-card/80 disabled:bg-card/40 text-foreground font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              {isAddingMiniApp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                  Adding...
                </>
              ) : (
                <>
                  <span>📱</span>
                  Add to Farcaster
                </>
              )}
            </button>
            
            {/* Add Miniapp Status Message */}
            {addMiniAppMessage && (
              <div className="mt-3 p-3 bg-card backdrop-blur-sm rounded-lg shadow-sm">
                <p className="text-sm text-foreground">{addMiniAppMessage}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verification Modal */}
      <Sheet open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full px-4">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl text-center">Identity Verification</SheetTitle>
              <SheetDescription className="text-center">
                Complete verification to access exclusive content
              </SheetDescription>
            </SheetHeader>
            
            <SelfVerify
              address={address}
              username={displayName}
              onSuccess={() => {
                setShowVerifyModal(false);
                // Navigate to verified page after successful verification
                setTimeout(() => {
                  router.push('/verified');
                }, 500);
              }}
              onError={(error) => {
                console.error('Verification error:', error);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
