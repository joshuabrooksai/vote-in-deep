import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Vote in Deep',
  projectId: 'YOUR_PROJECT_ID', // Replace with WalletConnect Cloud project ID
  chains: [sepolia],
  ssr: false,
});
