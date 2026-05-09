export type EasySelectInfo = {
  deviceType: number;
  printerName: string;
  macAddress: string;
  target?: string;
  serialNumber?: string;
  ssid?: string;
  passphrase?: string;
};

export type EasySelectCreateQROptions = {
  printerName: string;
  deviceType: number;
  macAddress: string;
};

export type EasySelectParseNFCOptions = {
  timeout?: number;
};

export type EasySelectParseBeaconOptions = {
  uuid: string;
  major?: number;
  minor?: number;
  timeout?: number;
};
