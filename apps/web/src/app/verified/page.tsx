"use client";
import { useMiniApp } from "@/contexts/miniapp-context";
import { useState } from "react";
import { useAccount } from "wagmi";
import { LinkCard } from "@/components/link-card";
import { SAMPLE_LINKS, Link } from "@/types/links";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function VerifiedPage() {
  const { context, isMiniAppReady } = useMiniApp();
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [links] = useState<Link[]>(SAMPLE_LINKS);
  
  // Wallet connection hooks
  const { address, isConnected } = useAccount();
  
  // Extract user data from context
  const user = context?.user;
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
          {/* Success Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-sm">Verified</span>
            </div>
          </div>

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
            {links
              .filter(link => link.enabled)
              .map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onClick={(link) => setSelectedLink(link)}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Link Details Sheet/Modal */}
      <Sheet open={!!selectedLink} onOpenChange={(open) => !open && setSelectedLink(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <div className="max-w-2xl mx-auto w-full px-4">
            <SheetHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-md">
                  {selectedLink?.icon || '🔗'}
                </div>
                <div className="flex-1 text-left">
                  <SheetTitle className="text-xl">{selectedLink?.title}</SheetTitle>
                  <SheetDescription>{selectedLink?.description}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            {/* Empty state for now - will be filled with link-specific content */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="text-4xl">{selectedLink?.icon || '🔗'}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Link Details
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                This modal will display additional information and actions for this link.
              </p>
              
              {/* URL Display */}
              {selectedLink?.url && (
                <div className="w-full bg-card rounded-lg p-4 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">URL</p>
                  <p className="text-sm text-foreground font-mono break-all">
                    {selectedLink.url}
                  </p>
                </div>
              )}
              
              {/* Action Button Placeholder */}
              <button
                onClick={() => {
                  // Will implement actual link opening logic later
                  console.log('Opening link:', selectedLink?.url);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Open Link
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
