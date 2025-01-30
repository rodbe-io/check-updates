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
  commandToInstall: string;
  dontAskCheckInterval?: number;
  packageJsonPath: string;
  updateCheckInterval?: number;
  updateQuestion?: string;
}
