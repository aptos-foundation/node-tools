import {
  CheckSummary,
  ConfigurationDescriptor,
  NodeCheckerClient,
} from "aptos-node-checker-client";
import {GlobalState} from "../../GlobalState";

export const DEFAULT_NHC_INSTANCE = "https://node-checker.dev.gcp.aptosdev.com";

export const NHC_INSTANCE_OVERRIDES = {
  local: "http://127.0.0.1:20121",
};

export type NhcInstanceOverride = keyof typeof NHC_INSTANCE_OVERRIDES;

export function determineNhcUrl(state: GlobalState) {
  if (state.network_name in NHC_INSTANCE_OVERRIDES) {
    return NHC_INSTANCE_OVERRIDES[state.network_name as NhcInstanceOverride];
  }
  return DEFAULT_NHC_INSTANCE;
}

function getClient(url: string) {
  return new NodeCheckerClient({
    BASE: url,
  });
}

export async function checkNode({
  nhcUrl,
  nodeUrl,
  baselineConfigurationId,
  apiPort,
  noisePort,
  metricsPort,
  publicKey,
}: {
  nhcUrl: string;
  nodeUrl: string;
  baselineConfigurationId: string;
  apiPort?: number | undefined;
  noisePort?: number | undefined;
  metricsPort?: number | undefined;
  publicKey?: string | undefined;
}): Promise<CheckSummary> {
  console.log(`apiPort okay: ${apiPort}`);
  const client = getClient(nhcUrl);
  return client.default.getCheck({
    baselineConfigurationId,
    nodeUrl,
    apiPort,
    noisePort,
    metricsPort,
    publicKey,
  });
}

// Return map of ID to ConfigirationDescriptor.
export async function getConfigurations({
  nhcUrl,
}: {
  nhcUrl: string;
}): Promise<Map<string, ConfigurationDescriptor>> {
  const client = getClient(nhcUrl);
  let configurations = await client.default.getConfigurations();
  console.log(`Configurations are ${JSON.stringify(configurations)}`);
  configurations.sort((a, b) => a.id.localeCompare(b.id));
  let out = new Map<string, ConfigurationDescriptor>();
  for (const configuration of configurations) {
    out.set(configuration.id, configuration);
  }
  return out;
}
