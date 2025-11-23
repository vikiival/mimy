"use client";
import { useMiniApp } from "@/contexts/miniapp-context";
import { useState } from "react";
import { useAccount } from "wagmi";
import { SAMPLE_PERKS, Perk } from "@/types/links";
import { signMessage } from "@/lib/halo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function VerifiedPage() {
  const { context, isMiniAppReady } = useMiniApp();
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [perks] = useState<Perk[]>(SAMPLE_PERKS);
  const [haloSignature, setHaloSignature] = useState<any>(null);
  const [isSigningWithHalo, setIsSigningWithHalo] = useState(false);
  const [haloError, setHaloError] = useState<string | null>(null);
  const [isSendingTokens, setIsSendingTokens] = useState(false);
  
  // Wallet connection hooks
  const { address, isConnected } = useAccount();
  
  // Extract user data from context
  const user = context?.user;
  const walletAddress = address || user?.custody || user?.verifications?.[0] || "0x832e535D4B9a110125AcBb1664EC0ee39D6a01C4";
  const displayName = user?.displayName || user?.username || "Viki";
  const username = user?.username || "@viki";
  const pfpUrl = user?.pfpUrl || "https://github.com/vikiival.png";
  
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

        {/* Success Badge */}
        <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm">Verified</span>
            </div>
        </div>

          {/* Perks Section */}
          <div className="space-y-3 mb-6">
            {perks.map((perk) => (
              <button
                key={perk.id}
                onClick={() => perk.enabled && setSelectedPerk(perk)}
                disabled={!perk.enabled}
                className={`w-full group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  perk.enabled
                    ? 'bg-card hover:bg-card/80 shadow-lg hover:shadow-xl cursor-pointer'
                    : 'bg-muted/50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md ${
                    perk.enabled
                      ? 'bg-gradient-to-br from-primary to-accent'
                      : 'bg-muted'
                  }`}>
                    {perk.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {perk.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {perk.description}
                    </p>
                    {perk.requirement && (
                      <p className="text-xs text-muted-foreground/80 italic">
                        {perk.requirement}
                      </p>
                    )}
                  </div>
                  {perk.enabled ? (
                    <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                {!perk.enabled && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {perk.type === 'tshirt' ? 'Out of stock' : 'Coming soon'}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Perk Details Sheet/Modal */}
      <Sheet open={!!selectedPerk} onOpenChange={(open) => !open && setSelectedPerk(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full px-4">
            <SheetHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-md">
                  {selectedPerk?.icon || '🎁'}
                </div>
                <div className="flex-1 text-left">
                  <SheetTitle className="text-xl">{selectedPerk?.title}</SheetTitle>
                  <SheetDescription>{selectedPerk?.description}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            {/* Token Claim Flow */}
            {selectedPerk?.type === 'token' && (
              <div className="space-y-4">
                {/* Requirements */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Requirements</p>
                      <p className="text-xs text-muted-foreground">{selectedPerk.requirement}</p>
                    </div>
                  </div>
                </div>

                {/* Token Details */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{selectedPerk.icon}</div>
                    <p className="text-3xl font-bold text-foreground mb-1">500</p>
                    <p className="text-sm text-muted-foreground">Tokens to claim</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-t border-border">
                      <span className="text-muted-foreground">Recipient</span>
                      <span className="text-foreground font-mono">{formatAddress(walletAddress)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-border">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-foreground font-semibold">500 Tokens</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-border">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${haloSignature ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {haloSignature ? '✓ Signed' : 'Not signed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HaLo Signature Section */}
                {!haloSignature && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                      Tap your HaLo chip to sign the transaction
                    </p>
                    <Button
                      onClick={async () => {
                        setIsSigningWithHalo(true);
                        setHaloError(null);
                        
                        try {
                          // Create the message to sign
                          const message = `Claim 500 tokens to ${walletAddress}`;
                          const signature = await signMessage(message, 1, 'text');
                          setHaloSignature(signature);
                        } catch (error: any) {
                          console.error('HaLo signing error:', error);
                          setHaloError(error.message || 'Failed to sign with HaLo chip');
                        } finally {
                          setIsSigningWithHalo(false);
                        }
                      }}
                      disabled={isSigningWithHalo}
                      className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-primary-foreground font-semibold py-6 text-base shadow-lg"
                    >
                      {isSigningWithHalo ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Tap your HaLo chip...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Sign with HaLo Chip
                        </>
                      )}
                    </Button>
                    
                    {haloError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{haloError}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Signature Display */}
                {haloSignature && (
                  <div className="space-y-3">
                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-semibold text-foreground">Signature Verified</h4>
                      </div>
                      <div className="bg-card rounded p-3 mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Ethereum Address</p>
                        <p className="text-xs font-mono text-foreground break-all mb-3">
                          {haloSignature.etherAddress}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">Signature</p>
                        <p className="text-xs font-mono text-foreground break-all">
                          {haloSignature.signature.ether}
                        </p>
                      </div>
                    </div>

                    {/* Send Transaction Button */}
                    <Button
                      onClick={async () => {
                        setIsSendingTokens(true);
                        try {
                          // Simulate transaction sending
                          await new Promise(resolve => setTimeout(resolve, 2000));
                          toast.success('Tokens claimed successfully! 🎉', {
                            description: '500 tokens have been sent to your wallet',
                          });
                          
                          // Close modal after a short delay
                          setTimeout(() => {
                            setSelectedPerk(null);
                            setHaloSignature(null);
                          }, 1500);
                        } catch (error) {
                          console.error('Transaction error:', error);
                          toast.error('Failed to send tokens', {
                            description: 'Please try again later',
                          });
                        } finally {
                          setIsSendingTokens(false);
                        }
                      }}
                      disabled={isSendingTokens}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-base shadow-lg"
                    >
                      {isSendingTokens ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Tokens...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Transaction
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Disabled Perks */}
            {(selectedPerk?.type === 'tshirt' || selectedPerk?.type === 'matcha') && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <span className="text-4xl">{selectedPerk?.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedPerk?.type === 'tshirt' ? 'Out of Stock' : 'Coming Soon'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  {selectedPerk?.type === 'tshirt' 
                    ? 'All T-shirt NFTs have been claimed. Check back later for restocks!'
                    : 'This perk is not available yet. Check back later!'}
                </p>
                {selectedPerk.requirement && (
                  <div className="w-full bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Requirement:</span> {selectedPerk.requirement}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
