if (typeof __dirname === 'undefined') {
  global.__dirname = '/';
}
if (typeof __filename === 'undefined') {
  global.__filename = '';
}
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

if (typeof BigInt === 'undefined') {
  global.BigInt = require('big-integer');
}

process.browser = false;
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__;
process.env.NODE_ENV = isDev ? 'development' : 'production';
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

import { NativeModules } from 'react-native';
const Aes = NativeModules.Aes;

require('crypto').pbkdf2 = async (
  password,
  salt,
  cost,
  length,
  ignore,
  callback,
) => {
  try {
    const encrypt = await Aes.pbkdf2(
      password,
      salt.toString(),
      cost,
      length * 4,
    );
    callback(null, encrypt);
  } catch (e) {
    callback(e);
  }
};
