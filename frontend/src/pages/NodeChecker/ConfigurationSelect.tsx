import React, {useEffect, useState} from "react";
import {FormControl, Select, SelectChangeEvent} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import SvgIcon, {SvgIconProps} from "@mui/material/SvgIcon";
import Box from "@mui/material/Box";
import {grey} from "../../themes/colors/aptosColorPalette";
import {determineNhcUrl, getConfigurations} from "./Client";
import {ConfigurationDescriptor} from "aptos-node-checker-client";
import {useGlobalState} from "../../GlobalState";
import {useSearchParams} from "react-router-dom";

interface ConfigurationSelectProps {
  baselineConfiguration: ConfigurationDescriptor | undefined;
  updateBaselineConfiguration: (
    configuration: ConfigurationDescriptor | undefined,
  ) => void;
  updateErrorMessage: (message: string | undefined) => void;
}

export default function ConfigurationSelect({
  baselineConfiguration,
  updateBaselineConfiguration,
  updateErrorMessage,
}: ConfigurationSelectProps) {
  const [state, _dispatch] = useGlobalState();

  const [validConfigurations, updateValidConfigurations] = useState<
    Map<string, ConfigurationDescriptor> | undefined
  >(undefined);

  const [searchParams, _setSearchParams] = useSearchParams();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const configurationKey = event.target.value;
    updateBaselineConfiguration(validConfigurations!.get(configurationKey));
  };

  // This triggers whenever the selected network changes.
  useEffect(() => {
    // Clear the values to begin with.
    updateBaselineConfiguration(undefined);
    updateValidConfigurations(undefined);

    // Set the valid configurations.
    const nhcUrl = determineNhcUrl(state);
    getConfigurations({nhcUrl: nhcUrl})
      .then((configurations) => {
        updateValidConfigurations(configurations);
        // If a configuration was included in the URL and it is a valid option,
        // use that. Otherwise just use the first one.
        if (searchParams.get("baselineConfig")) {
          const configurationKey = searchParams.get("baselineConfig")!;
          if (configurations.has(configurationKey)) {
            updateBaselineConfiguration(configurations.get(configurationKey));
          } else {
            updateBaselineConfiguration(configurations.values().next().value);
          }
        } else {
          updateBaselineConfiguration(configurations.values().next().value);
        }
        updateErrorMessage(undefined);
      })
      .catch((error) => {
        updateErrorMessage(
          `Failed to connect to Node Health Checker at ${nhcUrl}`,
        );
        console.log(
          `Failed to connect to Node Health Checker at ${nhcUrl}: ${error}`,
        );
        console.trace(error);
        updateBaselineConfiguration(undefined);
        updateValidConfigurations(undefined);
      });
  }, [state.network_name, searchParams]);

  function DropdownIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M16.6,9.7l-2.9,3c-1,1-2.8,1-3.8,0l-2.6-3l-0.8,0.7l2.6,3c0.7,0.7,1.6,1.1,2.6,1.1c1,0,2-0.4,2.6-1.1l2.9-3 L16.6,9.7z" />
      </SvgIcon>
    );
  }

  const theme = useTheme();

  let menuItems = null;
  if (validConfigurations !== undefined) {
    menuItems = Array.from(validConfigurations).map(
      ([configurationId, configuration]) => (
        <MenuItem key={configurationId} value={configurationId}>
          {configuration.pretty_name}
        </MenuItem>
      ),
    );
  }

  return (
    <Box>
      <FormControl fullWidth>
        <Select
          id="configuration-select"
          inputProps={{"aria-label": "Select Baseline Configuration"}}
          value={baselineConfiguration?.id ?? ""}
          onChange={handleChange}
          onClose={() => {
            setTimeout(() => {
              (document.activeElement as HTMLElement)?.blur();
            }, 0);
          }}
          variant="outlined"
          autoWidth
          IconComponent={DropdownIcon}
          sx={{
            borderRadius: 1,
            fontWeight: "400",
            fontSize: "1rem",
            color: "inherit",
            alignItems: "center",
            "& .MuiSvgIcon-root": {
              color: theme.palette.text.secondary,
            },
          }}
          // Dropdown container overrides
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              sx: {
                boxShadow: "0 25px 50px -12px rgba(18,22,21,0.25)",
                marginTop: 0.5,
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: `${
                    theme.palette.mode === "dark" ? grey[700] : grey[200]
                  }!important`,
                  pointerEvents: "none",
                },
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "transparent",
                  color: `${theme.palette.primary.main}`,
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Select Baseline Configuration
          </MenuItem>
          {menuItems}
        </Select>
      </FormControl>
    </Box>
  );
}
