import { useState, useEffect } from "react";
import SubCard from "ui-component/cards/SubCard";
import {
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  Button,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { showSuccess, showError, verifyJSON } from "utils/common";
import { API } from "utils/api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
require("dayjs/locale/en");

const OperationSetting = () => {
  let now = new Date();
  let [inputs, setInputs] = useState({
    QuotaForNewUser: 0,
    QuotaForInviter: 0,
    QuotaForInvitee: 0,
    QuotaRemindThreshold: 0,
    PreConsumedQuota: 0,
    ModelRatio: "",
    CompletionRatio: "",
    GroupRatio: "",
    TopUpLink: "",
    ChatLink: "",
    QuotaPerUnit: 0,
    AutomaticDisableChannelEnabled: "",
    AutomaticEnableChannelEnabled: "",
    ChannelDisableThreshold: 0,
    LogConsumeEnabled: "",
    DisplayInCurrencyEnabled: "",
    DisplayTokenStatEnabled: "",
    ApproximateTokenEnabled: "",
    RetryTimes: 0,
  });
  const [originInputs, setOriginInputs] = useState({});
  let [loading, setLoading] = useState(false);
  let [historyTimestamp, setHistoryTimestamp] = useState(
    now.getTime() / 1000 - 30 * 24 * 3600
  ); // a month ago new Date().getTime() / 1000 + 3600

  const getOptions = async () => {
    const res = await API.get("/api/option/");
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        if (item.key === "ModelRatio" || item.key === "GroupRatio" || item.key === "CompletionRatio") {
          item.value = JSON.stringify(JSON.parse(item.value), null, 2);
        }
        if (item.value === '{}') {
          item.value = '';
        }
        newInputs[item.key] = item.value;
      });
      setInputs(newInputs);
      setOriginInputs(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    if (key.endsWith("Enabled")) {
      value = inputs[key] === "true" ? "false" : "true";
    }
    const res = await API.put("/api/option/", {
      key,
      value,
    });
    const { success, message } = res.data;
    if (success) {
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    let { name, value } = event.target;

    if (name.endsWith("Enabled")) {
      await updateOption(name, value);
      showSuccess("Settings saved successfully!");
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    }
  };

  const submitConfig = async (group) => {
    switch (group) {
      case "monitor":
        if (
          originInputs["ChannelDisableThreshold"] !==
          inputs.ChannelDisableThreshold
        ) {
          await updateOption(
            "ChannelDisableThreshold",
            inputs.ChannelDisableThreshold
          );
        }
        if (
          originInputs["QuotaRemindThreshold"] !== inputs.QuotaRemindThreshold
        ) {
          await updateOption(
            "QuotaRemindThreshold",
            inputs.QuotaRemindThreshold
          );
        }
        break;
      case "ratio":
        if (originInputs["ModelRatio"] !== inputs.ModelRatio) {
          if (!verifyJSON(inputs.ModelRatio)) {
            showError("Model ratio is not a valid JSON string");
            return;
          }
          await updateOption("ModelRatio", inputs.ModelRatio);
        }
        if (originInputs["GroupRatio"] !== inputs.GroupRatio) {
          if (!verifyJSON(inputs.GroupRatio)) {
            showError("Group ratio is not a valid JSON string");
            return;
          }
          await updateOption("GroupRatio", inputs.GroupRatio);
        }
        if (originInputs['CompletionRatio'] !== inputs.CompletionRatio) {
          if (!verifyJSON(inputs.CompletionRatio)) {
            showError('Completion ratio is not a valid JSON string');
            return;
          }
          await updateOption('CompletionRatio', inputs.CompletionRatio);
        }
        break;
      case "quota":
        if (originInputs["QuotaForNewUser"] !== inputs.QuotaForNewUser) {
          await updateOption("QuotaForNewUser", inputs.QuotaForNewUser);
        }
        if (originInputs["QuotaForInvitee"] !== inputs.QuotaForInvitee) {
          await updateOption("QuotaForInvitee", inputs.QuotaForInvitee);
        }
        if (originInputs["QuotaForInviter"] !== inputs.QuotaForInviter) {
          await updateOption("QuotaForInviter", inputs.QuotaForInviter);
        }
        if (originInputs["PreConsumedQuota"] !== inputs.PreConsumedQuota) {
          await updateOption("PreConsumedQuota", inputs.PreConsumedQuota);
        }
        break;
      case "general":
        if (originInputs["TopUpLink"] !== inputs.TopUpLink) {
          await updateOption("TopUpLink", inputs.TopUpLink);
        }
        if (originInputs["ChatLink"] !== inputs.ChatLink) {
          await updateOption("ChatLink", inputs.ChatLink);
        }
        if (originInputs["QuotaPerUnit"] !== inputs.QuotaPerUnit) {
          await updateOption("QuotaPerUnit", inputs.QuotaPerUnit);
        }
        if (originInputs["RetryTimes"] !== inputs.RetryTimes) {
          await updateOption("RetryTimes", inputs.RetryTimes);
        }
        break;
    }

    showSuccess("Saved successfully!");
  };

  const deleteHistoryLogs = async () => {
    const res = await API.delete(
      `/api/log/?target_timestamp=${Math.floor(historyTimestamp)}`
    );
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(`${data} logs cleaned up!`);
      return;
    }
    showError("Log cleanup failed: " + message);
  };

  return (
    <Stack spacing={2}>
      <SubCard title="General Settings">
        <Stack justifyContent="flex-start" alignItems="flex-start" spacing={2}>
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ xs: 3, sm: 2, md: 4 }}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="TopUpLink">Top-Up Link</InputLabel>
              <OutlinedInput
                id="TopUpLink"
                name="TopUpLink"
                value={inputs.TopUpLink}
                onChange={handleInputChange}
                label="Top-Up Link"
                placeholder="e.g. the purchase link of the card-selling website"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="ChatLink">Chat Link</InputLabel>
              <OutlinedInput
                id="ChatLink"
                name="ChatLink"
                value={inputs.ChatLink}
                onChange={handleInputChange}
                label="Chat Link"
                placeholder="e.g. the deployment address of ChatGPT Next Web"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="QuotaPerUnit">Quota Per Unit</InputLabel>
              <OutlinedInput
                id="QuotaPerUnit"
                name="QuotaPerUnit"
                value={inputs.QuotaPerUnit}
                onChange={handleInputChange}
                label="Quota Per Unit"
                placeholder="The quota one unit of currency can redeem"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="RetryTimes">Retry Times</InputLabel>
              <OutlinedInput
                id="RetryTimes"
                name="RetryTimes"
                value={inputs.RetryTimes}
                onChange={handleInputChange}
                label="Retry Times"
                placeholder="Retry times"
                disabled={loading}
              />
            </FormControl>
          </Stack>
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ xs: 3, sm: 2, md: 4 }}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <FormControlLabel
              sx={{ marginLeft: "0px" }}
              label="Display quota in currency"
              control={
                <Checkbox
                  checked={inputs.DisplayInCurrencyEnabled === "true"}
                  onChange={handleInputChange}
                  name="DisplayInCurrencyEnabled"
                />
              }
            />

            <FormControlLabel
              label="Billing-related APIs show token quota instead of user quota"
              control={
                <Checkbox
                  checked={inputs.DisplayTokenStatEnabled === "true"}
                  onChange={handleInputChange}
                  name="DisplayTokenStatEnabled"
                />
              }
            />

            <FormControlLabel
              label="Use an approximate method to estimate token count to reduce computation"
              control={
                <Checkbox
                  checked={inputs.ApproximateTokenEnabled === "true"}
                  onChange={handleInputChange}
                  name="ApproximateTokenEnabled"
                />
              }
            />
          </Stack>
          <Button
            variant="contained"
            onClick={() => {
              submitConfig("general").then();
            }}
          >
            Save General Settings
          </Button>
        </Stack>
      </SubCard>
      <SubCard title="Log Settings">
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <FormControlLabel
            label="Enable log consumption"
            control={
              <Checkbox
                checked={inputs.LogConsumeEnabled === "true"}
                onChange={handleInputChange}
                name="LogConsumeEnabled"
              />
            }
          />

          <FormControl>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={'en'}
            >
              <DateTimePicker
                label="Log cleanup time"
                placeholder="Log cleanup time"
                ampm={false}
                name="historyTimestamp"
                value={
                  historyTimestamp === null
                    ? null
                    : dayjs.unix(historyTimestamp)
                }
                disabled={loading}
                onChange={(newValue) => {
                  setHistoryTimestamp(
                    newValue === null ? null : newValue.unix()
                  );
                }}
                slotProps={{
                  actionBar: {
                    actions: ["today", "clear", "accept"],
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              deleteHistoryLogs().then();
            }}
          >
            Clean Up History Logs
          </Button>
        </Stack>
      </SubCard>
      <SubCard title="Monitoring Settings">
        <Stack justifyContent="flex-start" alignItems="flex-start" spacing={2}>
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ xs: 3, sm: 2, md: 4 }}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="ChannelDisableThreshold">
                Max Response Time
              </InputLabel>
              <OutlinedInput
                id="ChannelDisableThreshold"
                name="ChannelDisableThreshold"
                type="number"
                value={inputs.ChannelDisableThreshold}
                onChange={handleInputChange}
                label="Max Response Time"
                placeholder="In seconds. When running all channel tests, channels exceeding this time will be automatically disabled"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="QuotaRemindThreshold">
                Quota Reminder Threshold
              </InputLabel>
              <OutlinedInput
                id="QuotaRemindThreshold"
                name="QuotaRemindThreshold"
                type="number"
                value={inputs.QuotaRemindThreshold}
                onChange={handleInputChange}
                label="Quota Reminder Threshold"
                placeholder="An email reminder will be sent to the user when quota falls below this threshold"
                disabled={loading}
              />
            </FormControl>
          </Stack>
          <FormControlLabel
            label="Automatically disable channels on failure"
            control={
              <Checkbox
                checked={inputs.AutomaticDisableChannelEnabled === "true"}
                onChange={handleInputChange}
                name="AutomaticDisableChannelEnabled"
              />
            }
          />
          <FormControlLabel
            label="Automatically enable channels on success"
            control={
              <Checkbox
                checked={inputs.AutomaticEnableChannelEnabled === "true"}
                onChange={handleInputChange}
                name="AutomaticEnableChannelEnabled"
              />
            }
          />
          <Button
            variant="contained"
            onClick={() => {
              submitConfig("monitor").then();
            }}
          >
            Save Monitoring Settings
          </Button>
        </Stack>
      </SubCard>
      <SubCard title="Quota Settings">
        <Stack justifyContent="flex-start" alignItems="flex-start" spacing={2}>
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ xs: 3, sm: 2, md: 4 }}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="QuotaForNewUser">Initial Quota for New Users</InputLabel>
              <OutlinedInput
                id="QuotaForNewUser"
                name="QuotaForNewUser"
                type="number"
                value={inputs.QuotaForNewUser}
                onChange={handleInputChange}
                label="Initial Quota for New Users"
                placeholder="e.g. 100"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="PreConsumedQuota">Pre-consumed Quota per Request</InputLabel>
              <OutlinedInput
                id="PreConsumedQuota"
                name="PreConsumedQuota"
                type="number"
                value={inputs.PreConsumedQuota}
                onChange={handleInputChange}
                label="Pre-consumed Quota per Request"
                placeholder="Refunded or charged extra after the request completes"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="QuotaForInviter">
                Quota Reward for Inviting New Users
              </InputLabel>
              <OutlinedInput
                id="QuotaForInviter"
                name="QuotaForInviter"
                type="number"
                label="Quota Reward for Inviting New Users"
                value={inputs.QuotaForInviter}
                onChange={handleInputChange}
                placeholder="e.g. 2000"
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="QuotaForInvitee">
                Quota Reward for New Users Using an Invite Code
              </InputLabel>
              <OutlinedInput
                id="QuotaForInvitee"
                name="QuotaForInvitee"
                type="number"
                label="Quota Reward for New Users Using an Invite Code"
                value={inputs.QuotaForInvitee}
                onChange={handleInputChange}
                autoComplete="new-password"
                placeholder="e.g. 1000"
                disabled={loading}
              />
            </FormControl>
          </Stack>
          <Button
            variant="contained"
            onClick={() => {
              submitConfig("quota").then();
            }}
          >
            Save Quota Settings
          </Button>
        </Stack>
      </SubCard>
      <SubCard title="Ratio Settings">
        <Stack justifyContent="flex-start" alignItems="flex-start" spacing={2}>
          <FormControl fullWidth>
            <TextField
              multiline
              maxRows={15}
              id="channel-ModelRatio-label"
              label="Model Ratio"
              value={inputs.ModelRatio}
              name="ModelRatio"
              onChange={handleInputChange}
              aria-describedby="helper-text-channel-ModelRatio-label"
              minRows={5}
              placeholder="A JSON text with model names as keys and ratios as values"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              multiline
              maxRows={15}
              id="channel-CompletionRatio-label"
              label="Completion Ratio"
              value={inputs.CompletionRatio}
              name="CompletionRatio"
              onChange={handleInputChange}
              aria-describedby="helper-text-channel-CompletionRatio-label"
              minRows={5}
              placeholder="A JSON text with model names as keys and ratios as values. The ratio here is the completion ratio relative to the prompt ratio; this setting can forcefully override One API's internal ratio"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              multiline
              maxRows={15}
              id="channel-GroupRatio-label"
              label="Group Ratio"
              value={inputs.GroupRatio}
              name="GroupRatio"
              onChange={handleInputChange}
              aria-describedby="helper-text-channel-GroupRatio-label"
              minRows={5}
              placeholder="A JSON text with group names as keys and ratios as values"
            />
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              submitConfig("ratio").then();
            }}
          >
            Save Ratio Settings
          </Button>
        </Stack>
      </SubCard>
    </Stack>
  );
};

export default OperationSetting;
