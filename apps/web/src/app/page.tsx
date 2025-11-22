"use client";
import { useMiniApp } from "@/contexts/miniapp-context";
import { sdk } from "@farcaster/frame-sdk";
import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { LinkCard } from "@/components/link-card";
import { SAMPLE_LINKS, Link } from "@/types/links";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Home() {
  const { context, isMiniAppReady } = useMiniApp();
  const [isAddingMiniApp, setIsAddingMiniApp] = useState(false);
  const [addMiniAppMessage, setAddMiniAppMessage] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [links] = useState<Link[]>(SAMPLE_LINKS);
  
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
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-full max-w-md mx-auto p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </main>
    );
  }
  
  return (
    <main className="flex-1">
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="w-full max-w-md mx-auto px-6">
          {/* Profile Section */}
          <div className="text-center mb-8">
            {/* Profile Avatar */}
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {displayName}
              </h1>
              <p className="text-gray-600 text-sm mb-3">
                {username.startsWith('@') ? username : `@${username}`}
              </p>
              
              {/* Wallet Address Chip */}
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs text-gray-700 font-mono">
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
              className="w-full bg-white/60 hover:bg-white/80 disabled:bg-white/40 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
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
              <div className="mt-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">{addMiniAppMessage}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Link Details Sheet/Modal */}
      <Sheet open={!!selectedLink} onOpenChange={(open) => !open && setSelectedLink(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-md">
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
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-4xl">{selectedLink?.icon || '🔗'}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Link Details
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              This modal will display additional information and actions for this link.
            </p>
            
            {/* URL Display */}
            {selectedLink?.url && (
              <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">URL</p>
                <p className="text-sm text-gray-700 font-mono break-all">
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
        </SheetContent>
      </Sheet>
    </main>
  );
}
