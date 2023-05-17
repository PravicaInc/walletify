import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '../useWallet/useWallet';
import { decodeToken } from 'jsontokens';
import { Linking } from 'react-native';
import { useTransactionRequest } from '../transactions/useTransactionRequest';
import { getParameterByName } from './utils';
import { TransactionPayload } from '@stacks/connect';
import { useAtomValue } from 'jotai/utils';
import { transactionRequestTokenPayloadState } from '../transactions/requests';

export function useTransactionRequestListener() {
  const { walletState } = useWallet();
  const saveTransactionRequest = useTransactionRequest();
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const [transactionRequestToken, setTransactionRequestToken] = useState<
    string | undefined
  >();

  useEffect(() => {
    const subscription = Linking.addListener('url', ({ url }) => {
      Linking.canOpenURL(url).then(supported => {
        const token = getParameterByName('request', url);
        if (supported && token) {
          setTransactionRequestToken(token);
        }
      });
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      Linking.canOpenURL(initialUrl || '').then(supported => {
        const token = getParameterByName('request', initialUrl || '');
        if (supported && token) {
          setTransactionRequestToken(token);
        }
      });
    };
    getUrlAsync();
  }, []);

  useEffect(() => {
    if (!transactionRequest) {
      setTransactionRequestToken(undefined);
    }
  }, [transactionRequest]);

  useEffect(() => {
    if (walletState && transactionRequestToken) {
      saveTransactionRequestParam();
    }
  }, [walletState, transactionRequestToken]);

  const saveTransactionRequestParam = useCallback(() => {
    if (transactionRequestToken) {
      const tokenPayload = decodeToken(transactionRequestToken)
        .payload as unknown as TransactionPayload;
      let appName = tokenPayload.appDetails?.name;
      let appIcon = tokenPayload.appDetails?.icon;

      if (!appIcon) {
        throw new Error('Missing `appIcon` from auth request');
      }
      if (!appName) {
        throw new Error('Missing `appName` from auth request');
      }

      saveTransactionRequest(tokenPayload);
    }
  }, [transactionRequestToken]);
}
