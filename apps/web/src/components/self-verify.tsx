"use client"

import React, { useEffect, useMemo, useState } from "react"
import { countries, SelfApp, SelfAppBuilder, SelfQRcodeWrapper, getUniversalLink } from "@selfxyz/qrcode"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Shield, CheckCircle } from "lucide-react"
import { Hex } from 'ox'

interface SelfVerifyProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
  address?: string
  username?: string
}

export function SelfVerify({ onSuccess, onError, className, address, username }: SelfVerifyProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null)
  const [universalLink, setUniversalLink] = useState("")
  const effectiveAddress = address || "0x0000000000000000000000000000000000000000"
  const userId = Hex.fromString(effectiveAddress)
  const excludedCountries = useMemo(() => [countries.NORTH_KOREA], [])

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Decentralized Linktree",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "linktree-verify",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT || "https://self-verify.example.com"}`,
        logoBase64: "https://i.imgur.com/Rz8B3s7.png",
        userId: effectiveAddress,
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: `Verify to see ${username || 'user'}'s links`,
        disclosures: {
          minimumAge: 18,
          nationality: true,
          gender: true,
        }
      }).build()

      setSelfApp(app)
      setUniversalLink(getUniversalLink(app))
    } catch (error) {
      console.error("Failed to initialize Self app:", error)
    }
  }, [effectiveAddress, username])

  const displayToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSuccessfulVerification = () => {
    setIsVerified(true)
    displayToast("Identity verified successfully!")
    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }
  }

  const handleError = () => {
    const errorMessage = "Failed to verify identity. Please try again."
    displayToast(errorMessage)
    if (onError) {
      onError(errorMessage)
    }
  }

  const handleCopyLink = () => {
    if (!universalLink) return

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true)
        displayToast("Universal link copied to clipboard!")
        setTimeout(() => setLinkCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        displayToast("Failed to copy link")
      })
  }

  const handleOpenApp = () => {
    if (!universalLink) return

    window.open(universalLink, "_blank")
    displayToast("Opening Self App...")
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="pb-4">
        <div className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {isVerified ? "Verified!" : `Verify to See ${username}'s Perks`}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isVerified
              ? "Your identity has been successfully verified"
              : `Scan the QR code with the Self Protocol app to verify your identity and access exclusive links from ${username || 'this user'}`}
          </p>
        </div>
        
        <div className="space-y-6">
          {!isVerified && (
            <>
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-card rounded-xl shadow-sm border border-border">
                  {selfApp ? (
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={handleSuccessfulVerification}
                      onError={handleError}
                    />
                  ) : (
                    <div className="w-[256px] h-[256px] bg-muted flex items-center justify-center rounded-lg">
                      <p className="text-muted-foreground text-sm">Loading QR Code...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCopyLink}
                  disabled={!universalLink}
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {linkCopied ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                  onClick={handleOpenApp}
                  disabled={!universalLink}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-md"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Self App
                </Button>
              </div>
            </>
          )}

          {/* User Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                {isVerified ? "Verified Address" : "Connected Address"}
              </span>
              {isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            <div className="bg-card rounded-lg px-3 py-2.5 text-center break-all text-sm font-mono text-foreground border border-border">
              {effectiveAddress !== "0x0000000000000000000000000000000000000000" ? (
                effectiveAddress
              ) : (
                <span className="text-muted-foreground">Not connected</span>
              )}
            </div>
          </div>

          {/* Instructions */}
          {!isVerified && (
            <div className="text-center text-sm text-muted-foreground space-y-3 pt-2">
              <p className="font-medium">Don't have the Self app?</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://apps.apple.com/app/self-protocol/id6443896588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent underline underline-offset-2 transition-colors"
                >
                  Download for iOS
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.selfxyz.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent underline underline-offset-2 transition-colors"
                >
                  Download for Android
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-lg shadow-xl animate-fade-in text-sm z-50 backdrop-blur-sm">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
