export interface RemoteNpmPackage {
  'dist-tags': {
    latest: string;
  };
}

export interface LocalNpmPackage {
  name: string;
  version: string;
}

export interface AvailabilityProps {
  askToUpdate?: boolean;
  dontAskCheckInterval?: number;
  isGlobal?: boolean;
  packageJsonPath: string;
  updateCheckInterval?: number;
  updateQuestion?: string;
}
