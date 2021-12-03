import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useEffect } from 'react';
import { currentStxPrice } from './stxPriceStore';

export const useStxPrice = () => {
  const [stxPrice, setStxPrice] = useAtom(currentStxPrice);
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/stxusdt@trade');
    ws.onmessage = e => {
      setStxPrice(JSON.parse(e.data).p);
    };
    ws.onerror = err => {
      console.log(err);
    };
    return () => {
      ws.close();
    };
  }, []);

  return {
    stxPrice,
  };
};

export const useStxPriceValue = () => {
  return useAtomValue(currentStxPrice);
};
