import { useCallback, useEffect, useState } from 'react';
import { DecodedAuthRequest } from '../../models/auth';
import { useAuthRequest } from '../auth/useAuthRequest';
import { useWallet } from '../useWallet/useWallet';
import { decodeToken } from 'jsontokens';
import { Linking } from 'react-native';
import { JSONSchemaForWebApplicationManifestFiles } from '@schemastore/web-manifest';

export interface AppManifest extends JSONSchemaForWebApplicationManifestFiles {
  appURLScheme?: string;
  bundleID?: string;
  packageName?: string;
}

const getParameterByName = (name: string, url: string) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const loadManifest = async (decodedAuthRequest: DecodedAuthRequest) => {
  const res = await fetch(decodedAuthRequest.manifest_uri);
  const json: AppManifest = await res.json();
  return json;
};

export function useAuthenticationListener() {
  const { walletState } = useWallet();
  const saveAuthRequest = useAuthRequest();
  const [authRequestToken, setAuthRequestToken] = useState<
    string | undefined
  >();

  useEffect(() => {
    const subscription = Linking.addListener('url', ({ url }) => {
      Linking.canOpenURL(url).then(supported => {
        const token = getParameterByName('token', url);
        if (supported && token) {
          setAuthRequestToken(token);
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
        const token = getParameterByName('token', initialUrl || '');
        if (supported && token) {
          setAuthRequestToken(token);
        }
      });
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
