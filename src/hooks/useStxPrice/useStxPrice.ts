import { useCallback, useContext, useEffect } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { useInternetConnectionValue } from '../useInternetConnnection';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';

export const useStxPrice = () => {
  const { setStxPrice } = useContext(UserPreferenceContext);
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
  const { stxPrice } = useContext(UserPreferenceContext);
  return stxPrice;
};
