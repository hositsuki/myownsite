'use client';

import { useState } from 'react';
import { useAccount, useConnect, useContractWrite, useDisconnect, useWaitForTransaction } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { parseEther } from 'viem';

const SUBSCRIPTION_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "subscribe",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_subscriber", "type": "address"}],
    "name": "isSubscribed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function SubscriptionPayment() {
  const [error, setError] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  const { data: subscribeData, write: subscribe } = useContractWrite({
    address: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: SUBSCRIPTION_CONTRACT_ABI,
    functionName: 'subscribe',
    value: parseEther('0.002'),
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: subscribeData?.hash,
  });

  const handleSubscribe = async () => {
    try {
      setError('');
      if (!isConnected) {
        await connect();
      }
      subscribe?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Premium Subscription</h2>
      <p className="text-gray-600">Get access to exclusive content for just 0.002 ETH/month</p>
      
      {error && (
        <div className="w-full p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {isSuccess ? (
        <div className="w-full p-4 text-green-700 bg-green-100 rounded-lg">
          Successfully subscribed! Thank you for your support.
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`w-full px-6 py-3 text-white rounded-lg transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : isConnected ? 'Subscribe Now' : 'Connect Wallet'}
        </button>
      )}

      {isConnected && (
        <button
          onClick={() => disconnect()}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Disconnect Wallet
        </button>
      )}
    </div>
  );
}
