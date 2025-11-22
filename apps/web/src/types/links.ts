export type LinkType = 'social' | 'website' | 'custom' | 'nft' | 'wallet';

export interface Link {
  id: string;
  title: string;
  url: string;
  type: LinkType;
  icon?: string;
  description?: string;
  enabled: boolean;
}

export const SAMPLE_LINKS: Link[] = [
  {
    id: '1',
    title: 'Farcaster Profile',
    url: 'https://warpcast.com/username',
    type: 'social',
    icon: '🎭',
    description: 'Follow me on Farcaster',
    enabled: true,
  },
  {
    id: '2',
    title: 'Personal Website',
    url: 'https://example.com',
    type: 'website',
    icon: '🌐',
    description: 'Check out my portfolio',
    enabled: true,
  },
  {
    id: '3',
    title: 'GitHub',
    url: 'https://github.com/username',
    type: 'social',
    icon: '💻',
    description: 'View my code',
    enabled: true,
  },
  {
    id: '4',
    title: 'NFT Collection',
    url: 'https://zora.co/collect/...',
    type: 'nft',
    icon: '🖼️',
    description: 'My latest NFT drop',
    enabled: true,
  },
  {
    id: '5',
    title: 'Buy Me a Coffee',
    url: 'https://buymeacoffee.com/username',
    type: 'custom',
    icon: '☕',
    description: 'Support my work',
    enabled: true,
  },
  {
    id: '6',
    title: 'Twitter',
    url: 'https://twitter.com/username',
    type: 'social',
    icon: '🐦',
    description: 'Follow on X',
    enabled: false,
  },
];
