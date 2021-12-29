import { useCallback, useEffect, useState } from 'react';
import { DecodedAuthRequest } from '../../models/auth';
import { useAuthRequest } from '../auth/useAuthRequest';
import { useWallet } from '../useWallet/useWallet';
import { decodeToken } from 'jsontokens';
import { Linking } from 'react-native';
import { JSONSchemaForWebApplicationManifestFiles } from '@schemastore/web-manifest';
import { getParameterByName, loadManifest } from './utils';

export interface AppManifest extends JSONSchemaForWebApplicationManifestFiles {
  appURLScheme?: string;
  bundleID?: string;
  packageName?: string;
}

export function useAuthenticationListener() {
  const { walletState } = useWallet();
  const saveAuthRequest = useAuthRequest();
  const [authRequestToken, setAuthRequestToken] = useState<
    string | undefined
  >();

  useEffect(() => {
    const subscription = Linking.addListener('url', ({ url }) => {
      if (url) {
        Linking.canOpenURL(url).then(supported => {
          const token = getParameterByName('token', url);
          if (supported && token) {
            setAuthRequestToken(token);
          }
        });
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        Linking.canOpenURL(initialUrl || '').then(supported => {
          const token = getParameterByName('token', initialUrl || '');
          if (supported && token) {
            setAuthRequestToken(token);
          }
        });
      }
    };
    getUrlAsync();
  }, []);

  useEffect(() => {
    if (walletState && authRequestToken) {
      saveAuthRequestParam(authRequestToken);
    }
  }, [walletState, authRequestToken]);

  const saveAuthRequestParam = useCallback(async (authRequest: string) => {
    const { payload } = decodeToken(authRequest);
    const decodedAuthRequest = payload as unknown as DecodedAuthRequest;
    let appName = decodedAuthRequest.appDetails?.name;
    let appIcon = decodedAuthRequest.appDetails?.icon;
    if (!appName || !appIcon) {
      const appManifest = await loadManifest(decodedAuthRequest);
      appName = appManifest.name;
      appIcon = appManifest.icons[0].src as string;
    }

    if (!appIcon) {
      throw new Error('Missing `appIcon` from auth request');
    }
    if (!appName) {
      throw new Error('Missing `appName` from auth request');
    }

    saveAuthRequest({
      decodedAuthRequest,
      authRequest,
      appName,
      appIcon,
      appURL: new URL(decodedAuthRequest.redirect_uri),
    });
  }, []);
}
