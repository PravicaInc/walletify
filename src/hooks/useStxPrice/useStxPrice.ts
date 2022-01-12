import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { currentStxPrice } from './stxPriceStore';
import { useCallback, useEffect } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { useInternetConnectionValue } from '../useInternetConnnection';

export const useStxPrice = () => {
  const [, setStxPrice] = useAtom(currentStxPrice);
  const currentAppState = useAppState();
  const hasInternet = useInternetConnectionValue();
  const handleInitialPrice = useCallback(() => {
    fetch('https://api.binance.com/api/v3/avgPrice?symbol=STXUSDT')
      .then(res => res.json())
      .then(res => {
        setStxPrice(res.price);
      });
  }, []);
  useEffect(() => {
    handleInitialPrice();
  }, []);
  useEffect(() => {
    if (hasInternet && currentAppState === 'active') {
      const ws = new WebSocket(
        'wss://stream.binance.com:9443/ws/stxusdt@trade',
      );
      ws.onmessage = e => {
        setStxPrice(JSON.parse(e.data).p);
      };
      ws.onerror = () => {
        handleInitialPrice();
      };
      return () => {
        ws.close();
      };
    }
  }, [hasInternet, currentAppState]);
};

export const useStxPriceValue = () => {
  return useAtomValue(currentStxPrice);
};
