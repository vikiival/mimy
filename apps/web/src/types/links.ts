export type LinkType = 'social' | 'website' | 'custom' | 'nft' | 'wallet';
export type PerkType = 'tshirt' | 'token' | 'matcha' | 'custom';

export interface Link {
  id: string;
  title: string;
  url: string;
  type: LinkType;
  icon?: string;
  description?: string;
  enabled: boolean;
}

export interface Perk {
  id: string;
  title: string;
  type: PerkType;
  icon: string;
  description: string;
  enabled: boolean;
  requirement?: string;
  action?: string;
}

export const SAMPLE_PERKS: Perk[] = [
  {
    id: '1',
    title: 'Claim T-Shirt NFT',
    type: 'tshirt',
    icon: '👕',
    description: 'Get your exclusive T-shirt NFT',
    enabled: false, // Out of stock
    requirement: 'Only for humans',
    action: 'Claim T-Shirt',
  },
  {
    id: '2',
    title: 'Claim 500 Tokens',
    type: 'token',
    icon: '🪙',
    description: 'Get 500 tokens sent to your wallet',
    enabled: true,
    requirement: 'Must be 18+ years old',
    action: 'Claim Tokens',
  },
  {
    id: '3',
    title: 'Free Cup of Matcha',
    type: 'matcha',
    icon: '🍵',
    description: 'Enjoy a complimentary matcha on us',
    enabled: false, // Only for girlies
    requirement: 'Only for girlies',
    action: 'Claim Matcha',
  },
];
