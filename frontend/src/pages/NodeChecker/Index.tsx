import React, {useEffect, useState} from "react";
import {Box, Button, Grid, Typography} from "@mui/material";
import HeadingSub from "../../components/HeadingSub";
import {
  ApiError,
  CheckSummary,
  ConfigurationDescriptor,
} from "aptos-node-checker-client";
import useUrlInput from "./hooks/useUrlInput";
import usePortInput from "./hooks/usePortInput";
import EvaluationDisplay from "./EvaluationDisplay";
import {checkNode, determineNhcUrl} from "./Client";
import ConfigurationSelect from "./ConfigurationSelect";
import {useGlobalState} from "../../GlobalState";
import ErrorSnackbar from "./ErrorSnackbar";
import useAddressInput from "../../api/hooks/useAddressInput";
import {useSearchParams} from "react-router-dom";
import {getRandomLoadingText} from "./hooks/helpers";

export function NodeCheckerPage() {
  const [state, _dispatch] = useGlobalState();

  const [checking, updateChecking] = useState<boolean>(false);
  const [checkSummary, updateCheckSummary] = useState<CheckSummary | undefined>(
    undefined,
  );
  const [baselineConfiguration, updateBaselineConfiguration] = useState<
    ConfigurationDescriptor | undefined
  >(undefined);
  const [errorMessage, updateErrorMessage] = useState<string | undefined>(
    undefined,
  );

  // Used for getting the text field values from the URL and updating the query params
  // when the user hits the "Check Node" button.
  const [searchParams, setSearchParams] = useSearchParams();

  // URL text input field.
  const {url, setUrl, renderUrlTextField, validateUrlInput} = useUrlInput(
    searchParams.get("url") || "",
  );

  // API port text input field.
  const {
    port: apiPort,
    setPort: setApiPort,
    renderPortTextField: renderApiPortTextField,
    validatePortInput: validateApiPortInput,
  } = usePortInput(searchParams.get("apiPort") || "");

  // Noise port text input field.
  const {
    port: noisePort,
    setPort: setNoisePort,
    renderPortTextField: renderNoisePortTextField,
    validatePortInput: validateNoisePortInput,
  } = usePortInput(searchParams.get("noisePort") || "");

  // Metrics port text input field.
  const {
    port: metricsPort,
    setPort: setMetricsPort,
    renderPortTextField: renderMetricsPortTextField,
    validatePortInput: validateMetricsPortInput,
  } = usePortInput(searchParams.get("metricsPort") || "");

  // Public key text input field.
  const {
    addr: publicKey,
    setAddr: setPublicKey,
    renderAddressTextField: renderPublicKeyTextField,
    validateAddressInput: validatePublicKeyAddressInput,
  } = useAddressInput(searchParams.get("publicKey") || "");

  const nhcUrl = determineNhcUrl(state);

  // Check whether all the input fields are valid.
  const inputIsValid = () => {
    const urlIsValid = validateUrlInput();
    const apiPortIsValid = validateApiPortInput();
    const noisePortIsValid = validateNoisePortInput();
    const metricsPortIsValid = validateMetricsPortInput();
    const publicKeyIsValid = validatePublicKeyAddressInput();
    return (
      urlIsValid &&
      apiPortIsValid &&
      noisePortIsValid &&
      publicKeyIsValid &&
      metricsPortIsValid &&
      baselineConfiguration !== undefined
    );
  };

  // Wrapper around updateBaselineConfiguration that also handles whether
  // the public key field is required.
  const updateBaselineConfigurationWrapper = (
    configuration: ConfigurationDescriptor | undefined,
  ) => {
    updateBaselineConfiguration(configuration);
  };

  const onCheckNodeButtonClick = async () => {
    if (checking) {
      return;
    }
    if (!inputIsValid()) {
      return;
    }
    updateChecking(true);
    updateCheckSummary(undefined);
    setSearchParams({
      network: state.network_name,
      url: url,
      apiPort: apiPort,
      noisePort: noisePort,
      metricsPort: metricsPort,
      publicKey: publicKey,
      baselineConfig: baselineConfiguration!.id,
    });
    try {
      console.log(`apiPort: ${apiPort}`);
      const checkSummary = await checkNode({
        nhcUrl: nhcUrl,
        nodeUrl: url,
        baselineConfigurationId: baselineConfiguration!.id,
        // TODO: Somehow make these port values numbers to begin with.
        apiPort: apiPort === "" ? undefined : parseInt(apiPort),
        noisePort: noisePort === "" ? undefined : parseInt(noisePort),
        metricsPort: metricsPort === "" ? undefined : parseInt(metricsPort),
        publicKey: publicKey === "" ? undefined : publicKey,
      });
      updateCheckSummary(checkSummary);
      updateErrorMessage(undefined);
    } catch (e) {
      let msg = `Failed to check node: ${e}`;
      if (e instanceof ApiError) {
        msg += `: ${e.body}`;
      }
      updateErrorMessage(msg);
    }
    updateChecking(false);
  };

  // Clear the results if the user changes the network or the search params.
  // Update the fields.
  useEffect(() => {
    updateCheckSummary(undefined);
    updateErrorMessage(undefined);
    setUrl(searchParams.get("url") || "");
    setApiPort(searchParams.get("apiPort") || "");
    setNoisePort(searchParams.get("noisePort") || "");
    setMetricsPort(searchParams.get("metricsPort") || "");
    setPublicKey(searchParams.get("publicKey") || "");
  }, [state.network_name, searchParams]);

  // Build the check node button, which could be disabled if we're actively
  // waiting for a response from the server.
  const checkNodeButton = (
    <span>
      <Button
        fullWidth
        variant="primary"
        onClick={onCheckNodeButtonClick}
        disabled={checking}
      >
        {checking ? "Checking node, please wait..." : "Check Node"}
      </Button>
    </span>
  );

  // Build a display of the evaluation summary if one has been received.
  // Otherwise display some info about how to make a request. TODO: Update the link here.
  let evaluationDisplay;
  if (checkSummary === undefined) {
    let inner;
    if (checking) {
      inner = <p>{getRandomLoadingText()}</p>;
    } else {
      inner = (
        <p>
          Only the node URL is required, other fields are only necessary if you
          want to check that component.{" "}
          <a href="https://github.com/aptos-labs/aptos-core/pull/5784">
            Learn more
          </a>
          .
        </p>
      );
    }
    evaluationDisplay = (
      <Box>
        <Box pt={3} />
        <Grid container justifyContent="center">
          {inner}
        </Grid>
      </Box>
    );
  } else {
    evaluationDisplay = <EvaluationDisplay checkSummary={checkSummary!} />;
  }

  return (
    <Grid container spacing={3}>
      <ErrorSnackbar
        errorMessage={errorMessage}
        updateErrorMessage={updateErrorMessage}
      />
      <Grid item xs={12}>
        <HeadingSub>BETA</HeadingSub>
        <Typography variant="h1" component="h1" gutterBottom>
          Node Health Checker
        </Typography>
        <Grid container spacing={4}>
          <Grid item md={5} xs={12}>
            {renderUrlTextField("Node URL")}
          </Grid>
          <Grid item md={1.4} xs={12}>
            {renderApiPortTextField("API Port")}
          </Grid>
          <Grid item md={1.4} xs={12}>
            {renderNoisePortTextField("Noise Port")}
          </Grid>
          <Grid item md={1.4} xs={12}>
            {renderMetricsPortTextField("Metrics Port")}
          </Grid>
          <Grid item md={2.8} xs={12}>
            <ConfigurationSelect
              baselineConfiguration={baselineConfiguration}
              updateBaselineConfiguration={updateBaselineConfigurationWrapper}
              updateErrorMessage={updateErrorMessage}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            {renderPublicKeyTextField("Public Key")}
          </Grid>
          <Grid item md={6} xs={12}>
            {checkNodeButton}
          </Grid>
        </Grid>
        {evaluationDisplay}
      </Grid>
    </Grid>
  );
}
