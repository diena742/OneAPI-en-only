import { useState, useEffect } from 'react';
import SubCard from 'ui-component/cards/SubCard';
import {
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  Button,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Autocomplete,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { showError, showSuccess, removeTrailingSlash } from 'utils/common'; //,
import { API } from 'utils/api';
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();
const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    PasswordRegisterEnabled: '',
    EmailVerificationEnabled: '',
    GitHubOAuthEnabled: '',
    GitHubClientId: '',
    GitHubClientSecret: '',
    LarkClientId: '',
    LarkClientSecret: '',
    OidcEnabled: '',
    OidcWellKnown: '',
    OidcClientId: '',
    OidcClientSecret: '',
    OidcAuthorizationEndpoint: '',
    OidcTokenEndpoint: '',
    OidcUserinfoEndpoint: '',
    Notice: '',
    SMTPServer: '',
    SMTPPort: '',
    SMTPAccount: '',
    SMTPFrom: '',
    SMTPToken: '',
    ServerAddress: '',
    Footer: '',
    WeChatAuthEnabled: '',
    WeChatServerAddress: '',
    WeChatServerToken: '',
    WeChatAccountQRCodeImageURL: '',
    TurnstileCheckEnabled: '',
    TurnstileSiteKey: '',
    TurnstileSecretKey: '',
    RegisterEnabled: '',
    EmailDomainRestrictionEnabled: '',
    EmailDomainWhitelist: [],
    MessagePusherAddress: '',
    MessagePusherToken: ''
  });
  const [originInputs, setOriginInputs] = useState({});
  let [loading, setLoading] = useState(false);
  const [EmailDomainWhitelist, setEmailDomainWhitelist] = useState([]);
  const [showPasswordWarningModal, setShowPasswordWarningModal] = useState(false);

  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        newInputs[item.key] = item.value;
      });
      setInputs({
        ...newInputs,
        EmailDomainWhitelist: newInputs.EmailDomainWhitelist.split(',')
      });
      setOriginInputs(newInputs);

      setEmailDomainWhitelist(newInputs.EmailDomainWhitelist.split(','));
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'PasswordRegisterEnabled':
      case 'EmailVerificationEnabled':
      case 'GitHubOAuthEnabled':
      case 'WeChatAuthEnabled':
      case 'TurnstileCheckEnabled':
      case 'EmailDomainRestrictionEnabled':
      case 'RegisterEnabled':
      case 'OidcEnabled':
        value = inputs[key] === 'true' ? 'false' : 'true';
        break;
      default:
        break;
    }
    const res = await API.put('/api/option/', {
      key,
      value
    });
    const { success, message } = res.data;
    if (success) {
      if (key === 'EmailDomainWhitelist') {
        value = value.split(',');
      }
      setInputs((inputs) => ({
        ...inputs,
        [key]: value
      }));
      showSuccess('Settings saved successfully!');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    let { name, value } = event.target;

    if (name === 'PasswordLoginEnabled' && inputs[name] === 'true') {
      // block disabling password login
      setShowPasswordWarningModal(true);
      return;
    }
    if (
      name === 'Notice' ||
      name.startsWith('SMTP') ||
      name === 'ServerAddress' ||
      name === 'GitHubClientId' ||
      name === 'GitHubClientSecret' ||
      name === 'WeChatServerAddress' ||
      name === 'WeChatServerToken' ||
      name === 'WeChatAccountQRCodeImageURL' ||
      name === 'TurnstileSiteKey' ||
      name === 'TurnstileSecretKey' ||
      name === 'EmailDomainWhitelist' ||
      name === 'MessagePusherAddress' ||
      name === 'MessagePusherToken' ||
      name === 'LarkClientId' ||
      name === 'LarkClientSecret' ||
      name === 'OidcClientId' ||
      name === 'OidcClientSecret' ||
      name === 'OidcWellKnown' ||
      name === 'OidcAuthorizationEndpoint' ||
      name === 'OidcTokenEndpoint' ||
      name === 'OidcUserinfoEndpoint'
    )
    {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitServerAddress = async () => {
    let ServerAddress = removeTrailingSlash(inputs.ServerAddress);
    await updateOption('ServerAddress', ServerAddress);
  };

  const submitSMTP = async () => {
    if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
      await updateOption('SMTPServer', inputs.SMTPServer);
    }
    if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
      await updateOption('SMTPAccount', inputs.SMTPAccount);
    }
    if (originInputs['SMTPFrom'] !== inputs.SMTPFrom) {
      await updateOption('SMTPFrom', inputs.SMTPFrom);
    }
    if (originInputs['SMTPPort'] !== inputs.SMTPPort && inputs.SMTPPort !== '') {
      await updateOption('SMTPPort', inputs.SMTPPort);
    }
    if (originInputs['SMTPToken'] !== inputs.SMTPToken && inputs.SMTPToken !== '') {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };

  const submitEmailDomainWhitelist = async () => {
    await updateOption('EmailDomainWhitelist', inputs.EmailDomainWhitelist.join(','));
  };

  const submitWeChat = async () => {
    if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
      await updateOption('WeChatServerAddress', removeTrailingSlash(inputs.WeChatServerAddress));
    }
    if (originInputs['WeChatAccountQRCodeImageURL'] !== inputs.WeChatAccountQRCodeImageURL) {
      await updateOption('WeChatAccountQRCodeImageURL', inputs.WeChatAccountQRCodeImageURL);
    }
    if (originInputs['WeChatServerToken'] !== inputs.WeChatServerToken && inputs.WeChatServerToken !== '') {
      await updateOption('WeChatServerToken', inputs.WeChatServerToken);
    }
  };

  const submitGitHubOAuth = async () => {
    if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
      await updateOption('GitHubClientId', inputs.GitHubClientId);
    }
    if (originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret && inputs.GitHubClientSecret !== '') {
      await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
    }
  };

  const submitTurnstile = async () => {
    if (originInputs['TurnstileSiteKey'] !== inputs.TurnstileSiteKey) {
      await updateOption('TurnstileSiteKey', inputs.TurnstileSiteKey);
    }
    if (originInputs['TurnstileSecretKey'] !== inputs.TurnstileSecretKey && inputs.TurnstileSecretKey !== '') {
      await updateOption('TurnstileSecretKey', inputs.TurnstileSecretKey);
    }
  };

  const submitMessagePusher = async () => {
    if (originInputs['MessagePusherAddress'] !== inputs.MessagePusherAddress) {
      await updateOption('MessagePusherAddress', removeTrailingSlash(inputs.MessagePusherAddress));
    }
    if (originInputs['MessagePusherToken'] !== inputs.MessagePusherToken && inputs.MessagePusherToken !== '') {
      await updateOption('MessagePusherToken', inputs.MessagePusherToken);
    }
  };

  const submitLarkOAuth = async () => {
    if (originInputs['LarkClientId'] !== inputs.LarkClientId) {
      await updateOption('LarkClientId', inputs.LarkClientId);
    }
    if (originInputs['LarkClientSecret'] !== inputs.LarkClientSecret && inputs.LarkClientSecret !== '') {
      await updateOption('LarkClientSecret', inputs.LarkClientSecret);
    }
  };

  const submitOidc = async () => {
    if (inputs.OidcWellKnown !== '') {
      if (!inputs.OidcWellKnown.startsWith('http://') && !inputs.OidcWellKnown.startsWith('https://')) {
        showError('Well-Known URL must start with http:// or https://');
        return;
      }
      try {
        const res = await API.get(inputs.OidcWellKnown);
        inputs.OidcAuthorizationEndpoint = res.data['authorization_endpoint'];
        inputs.OidcTokenEndpoint = res.data['token_endpoint'];
        inputs.OidcUserinfoEndpoint = res.data['userinfo_endpoint'];
        showSuccess('OIDC configuration fetched successfully!');
      } catch (err) {
        showError("Failed to fetch OIDC configuration. Please check your network and whether the Well-Known URL is correct");
      }
    }

    if (originInputs['OidcWellKnown'] !== inputs.OidcWellKnown) {
      await updateOption('OidcWellKnown', inputs.OidcWellKnown);
    }
    if (originInputs['OidcClientId'] !== inputs.OidcClientId) {
      await updateOption('OidcClientId', inputs.OidcClientId);
    }
    if (originInputs['OidcClientSecret'] !== inputs.OidcClientSecret && inputs.OidcClientSecret !== '') {
      await updateOption('OidcClientSecret', inputs.OidcClientSecret);
    }
    if (originInputs['OidcAuthorizationEndpoint'] !== inputs.OidcAuthorizationEndpoint) {
      await updateOption('OidcAuthorizationEndpoint', inputs.OidcAuthorizationEndpoint);
    }
    if (originInputs['OidcTokenEndpoint'] !== inputs.OidcTokenEndpoint) {
      await updateOption('OidcTokenEndpoint', inputs.OidcTokenEndpoint);
    }
    if (originInputs['OidcUserinfoEndpoint'] !== inputs.OidcUserinfoEndpoint) {
      await updateOption('OidcUserinfoEndpoint', inputs.OidcUserinfoEndpoint);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <SubCard title="General Settings">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="ServerAddress">Server Address</InputLabel>
                <OutlinedInput
                  id="ServerAddress"
                  name="ServerAddress"
                  value={inputs.ServerAddress || ''}
                  onChange={handleInputChange}
                  label="Server Address"
                  placeholder="e.g. https://yourdomain.com"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitServerAddress}>
                Update Server Address
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="Configure Login & Registration">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Allow login with password"
                control={
                  <Checkbox checked={inputs.PasswordLoginEnabled === 'true'} onChange={handleInputChange} name="PasswordLoginEnabled" />
                }
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Allow registration with password"
                control={
                  <Checkbox
                    checked={inputs.PasswordRegisterEnabled === 'true'}
                    onChange={handleInputChange}
                    name="PasswordRegisterEnabled"
                  />
                }
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Require email verification when registering with password"
                control={
                  <Checkbox
                    checked={inputs.EmailVerificationEnabled === 'true'}
                    onChange={handleInputChange}
                    name="EmailVerificationEnabled"
                  />
                }
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Allow login & registration with GitHub account"
                control={<Checkbox checked={inputs.GitHubOAuthEnabled === 'true'} onChange={handleInputChange} name="GitHubOAuthEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Allow OIDC login & registration"
                control={<Checkbox checked={inputs.OidcEnabled === 'true'} onChange={handleInputChange} name="OidcEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Allow WeChat login & registration"
                control={<Checkbox checked={inputs.WeChatAuthEnabled === 'true'} onChange={handleInputChange} name="WeChatAuthEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Allow new user registration (when disabled, new users cannot register through any method)"
                control={<Checkbox checked={inputs.RegisterEnabled === 'true'} onChange={handleInputChange} name="RegisterEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Enable Turnstile user verification"
                control={
                  <Checkbox checked={inputs.TurnstileCheckEnabled === 'true'} onChange={handleInputChange} name="TurnstileCheckEnabled" />
                }
              />
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="Configure Email Domain Whitelist" subTitle="To prevent malicious users from mass-registering with temporary emails">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <FormControlLabel
                label="Enable email domain whitelist"
                control={
                  <Checkbox
                    checked={inputs.EmailDomainRestrictionEnabled === 'true'}
                    onChange={handleInputChange}
                    name="EmailDomainRestrictionEnabled"
                  />
                }
              />
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  freeSolo
                  id="EmailDomainWhitelist"
                  options={EmailDomainWhitelist}
                  value={inputs.EmailDomainWhitelist}
                  onChange={(e, value) => {
                    const event = {
                      target: {
                        name: 'EmailDomainWhitelist',
                        value: value
                      }
                    };
                    handleInputChange(event);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => <TextField {...params} name="EmailDomainWhitelist" label="Allowed email domains" />}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push(inputValue);
                    }
                    return filtered;
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitEmailDomainWhitelist}>
                Save Email Domain Whitelist Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="Configure SMTP" subTitle="To support the system's email sending">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPServer">SMTP Server Address</InputLabel>
                <OutlinedInput
                  id="SMTPServer"
                  name="SMTPServer"
                  value={inputs.SMTPServer || ''}
                  onChange={handleInputChange}
                  label="SMTP Server Address"
                  placeholder="e.g. smtp.qq.com"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPPort">SMTP Port</InputLabel>
                <OutlinedInput
                  id="SMTPPort"
                  name="SMTPPort"
                  value={inputs.SMTPPort || ''}
                  onChange={handleInputChange}
                  label="SMTP Port"
                  placeholder="Default: 587"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPAccount">SMTP Account</InputLabel>
                <OutlinedInput
                  id="SMTPAccount"
                  name="SMTPAccount"
                  value={inputs.SMTPAccount || ''}
                  onChange={handleInputChange}
                  label="SMTP Account"
                  placeholder="Usually an email address"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPFrom">SMTP Sender Email</InputLabel>
                <OutlinedInput
                  id="SMTPFrom"
                  name="SMTPFrom"
                  value={inputs.SMTPFrom || ''}
                  onChange={handleInputChange}
                  label="SMTP Sender Email"
                  placeholder="Usually the same as the email address"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPToken">SMTP Access Credential</InputLabel>
                <OutlinedInput
                  id="SMTPToken"
                  name="SMTPToken"
                  value={inputs.SMTPToken || ''}
                  onChange={handleInputChange}
                  label="SMTP Access Credential"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitSMTP}>
                Save SMTP Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="Configure GitHub OAuth App"
          subTitle={
            <span>
              {' '}
              To support login and registration via GitHub,
              <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">
                click here
              </a>
              to manage your GitHub OAuth App
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
                Set Homepage URL to <b>{inputs.ServerAddress}</b>
                , and Authorization callback URL to <b>{`${inputs.ServerAddress}/oauth/github`}</b>
              </Alert>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="GitHubClientId">GitHub Client ID</InputLabel>
                <OutlinedInput
                  id="GitHubClientId"
                  name="GitHubClientId"
                  value={inputs.GitHubClientId || ''}
                  onChange={handleInputChange}
                  label="GitHub Client ID"
                  placeholder="Enter the ID of the GitHub OAuth App you registered"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="GitHubClientSecret">GitHub Client Secret</InputLabel>
                <OutlinedInput
                  id="GitHubClientSecret"
                  name="GitHubClientSecret"
                  value={inputs.GitHubClientSecret || ''}
                  onChange={handleInputChange}
                  label="GitHub Client Secret"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitGitHubOAuth}>
                Save GitHub OAuth Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="Configure Feishu (Lark) OAuth Login"
          subTitle={
            <span>
              {' '}
              To support login and registration via Feishu (Lark),
              <a href="https://open.feishu.cn/app" target="_blank" rel="noreferrer">
                click here
              </a>
              to manage your Feishu (Lark) app
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
                Set Homepage URL to <code>{inputs.ServerAddress}</code>
                , and Redirect URL to <code>{`${inputs.ServerAddress}/oauth/lark`}</code>
              </Alert>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="LarkClientId">App ID</InputLabel>
                <OutlinedInput
                  id="LarkClientId"
                  name="LarkClientId"
                  value={inputs.LarkClientId || ''}
                  onChange={handleInputChange}
                  label="App ID"
                  placeholder="Enter App ID"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="LarkClientSecret">App Secret</InputLabel>
                <OutlinedInput
                  id="LarkClientSecret"
                  name="LarkClientSecret"
                  value={inputs.LarkClientSecret || ''}
                  onChange={handleInputChange}
                  label="App Secret"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitLarkOAuth}>
                Save Feishu OAuth Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="Configure WeChat Server"
          subTitle={
            <span>
               To support login and registration via WeChat,
              <a href="https://github.com/songquanpeng/wechat-server" target="_blank" rel="noopener noreferrer">
                click here
              </a>
              to learn about WeChat Server
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="WeChatServerAddress">WeChat Server Address</InputLabel>
                <OutlinedInput
                  id="WeChatServerAddress"
                  name="WeChatServerAddress"
                  value={inputs.WeChatServerAddress || ''}
                  onChange={handleInputChange}
                  label="WeChat Server Address"
                  placeholder="e.g. https://yourdomain.com"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="WeChatServerToken">WeChat Server Access Credential</InputLabel>
                <OutlinedInput
                  id="WeChatServerToken"
                  name="WeChatServerToken"
                  value={inputs.WeChatServerToken || ''}
                  onChange={handleInputChange}
                  label="WeChat Server Access Credential"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="WeChatAccountQRCodeImageURL">WeChat Official Account QR Code Image URL</InputLabel>
                <OutlinedInput
                  id="WeChatAccountQRCodeImageURL"
                  name="WeChatAccountQRCodeImageURL"
                  value={inputs.WeChatAccountQRCodeImageURL || ''}
                  onChange={handleInputChange}
                  label="WeChat Official Account QR Code Image URL"
                  placeholder="Enter an image URL"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitWeChat}>
                Save WeChat Server Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>

        <SubCard
          title="Configure OIDC"
          subTitle={
            <span>
              To support login via OIDC, e.g. Okta, Auth0 and other IdPs compatible with the OIDC protocol
            </span>
          }
        >
          <Grid container spacing={ { xs: 3, sm: 2, md: 4 } }>
            <Grid xs={ 12 } md={ 12 }>
              <Alert severity="info" sx={ { wordWrap: 'break-word' } }>
                Set Homepage URL to <code>{ inputs.ServerAddress }</code>
                , and Redirect URL to <code>{ `${ inputs.ServerAddress }/oauth/oidc` }</code>
              </Alert> <br />
              <Alert severity="info" sx={ { wordWrap: 'break-word' } }>
                If your OIDC Provider supports a Discovery Endpoint, you can just fill in the OIDC Well-Known URL and the system will automatically fetch the OIDC configuration
              </Alert>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcClientId">Client ID</InputLabel>
                <OutlinedInput
                  id="OidcClientId"
                  name="OidcClientId"
                  value={ inputs.OidcClientId || '' }
                  onChange={ handleInputChange }
                  label="Client ID"
                  placeholder="Enter the OIDC Client ID"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcClientSecret">Client Secret</InputLabel>
                <OutlinedInput
                  id="OidcClientSecret"
                  name="OidcClientSecret"
                  value={ inputs.OidcClientSecret || '' }
                  onChange={ handleInputChange }
                  label="Client Secret"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcWellKnown">Well-Known URL</InputLabel>
                <OutlinedInput
                  id="OidcWellKnown"
                  name="OidcWellKnown"
                  value={ inputs.OidcWellKnown || '' }
                  onChange={ handleInputChange }
                  label="Well-Known URL"
                  placeholder="Please enter the OIDC Well-Known URL"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcAuthorizationEndpoint">Authorization Endpoint</InputLabel>
                <OutlinedInput
                  id="OidcAuthorizationEndpoint"
                  name="OidcAuthorizationEndpoint"
                  value={ inputs.OidcAuthorizationEndpoint || '' }
                  onChange={ handleInputChange }
                  label="Authorization Endpoint"
                  placeholder="Enter the OIDC Authorization Endpoint"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcTokenEndpoint">Token Endpoint</InputLabel>
                <OutlinedInput
                  id="OidcTokenEndpoint"
                  name="OidcTokenEndpoint"
                  value={ inputs.OidcTokenEndpoint || '' }
                  onChange={ handleInputChange }
                  label="Token Endpoint"
                  placeholder="Enter the OIDC Token Endpoint"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcUserinfoEndpoint">Userinfo Endpoint</InputLabel>
                <OutlinedInput
                  id="OidcUserinfoEndpoint"
                  name="OidcUserinfoEndpoint"
                  value={ inputs.OidcUserinfoEndpoint || '' }
                  onChange={ handleInputChange }
                  label="Userinfo Endpoint"
                  placeholder="Enter the OIDC Userinfo Endpoint"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 }>
              <Button variant="contained" onClick={ submitOidc }>
                Save OIDC Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>

        <SubCard
          title="Configure Message Pusher"
          subTitle={
            <span>
              To push alert messages,
              <a href="https://github.com/songquanpeng/message-pusher" target="_blank" rel="noreferrer">
                click here
              </a>
              to learn about Message Pusher
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="MessagePusherAddress">Message Pusher Push Address</InputLabel>
                <OutlinedInput
                  id="MessagePusherAddress"
                  name="MessagePusherAddress"
                  value={inputs.MessagePusherAddress || ''}
                  onChange={handleInputChange}
                  label="Message Pusher Push Address"
                  placeholder="e.g. https://msgpusher.com/push/your_username"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="MessagePusherToken">Message Pusher Access Credential</InputLabel>
                <OutlinedInput
                  id="MessagePusherToken"
                  name="MessagePusherToken"
                  type="password"
                  value={inputs.MessagePusherToken || ''}
                  onChange={handleInputChange}
                  label="Message Pusher Access Credential"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitMessagePusher}>
                Save Message Pusher Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="Configure Turnstile"
          subTitle={
            <span>
              To support user verification,
              <a href="https://dash.cloudflare.com/" target="_blank" rel="noopener noreferrer">
                click here
              </a>
              to manage your Turnstile Sites. It is recommended to choose the Invisible Widget Type
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="TurnstileSiteKey">Turnstile Site Key</InputLabel>
                <OutlinedInput
                  id="TurnstileSiteKey"
                  name="TurnstileSiteKey"
                  value={inputs.TurnstileSiteKey || ''}
                  onChange={handleInputChange}
                  label="Turnstile Site Key"
                  placeholder="Enter the Turnstile Site Key you registered"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="TurnstileSecretKey">Turnstile Secret Key</InputLabel>
                <OutlinedInput
                  id="TurnstileSecretKey"
                  name="TurnstileSecretKey"
                  type="password"
                  value={inputs.TurnstileSecretKey || ''}
                  onChange={handleInputChange}
                  label="Turnstile Secret Key"
                  placeholder="Sensitive information will not be sent to the frontend for display"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitTurnstile}>
                Save Turnstile Settings
              </Button>
            </Grid>
          </Grid>
        </SubCard>
      </Stack>
      <Dialog open={showPasswordWarningModal} onClose={() => setShowPasswordWarningModal(false)} maxWidth={'md'}>
        <DialogTitle sx={{ margin: '0px', fontWeight: 700, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
          Warning
        </DialogTitle>
        <Divider />
        <DialogContent>Disabling password login will prevent all users (including administrators) who have not bound other login methods from logging in with a password. Confirm disabling?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordWarningModal(false)}>Cancel</Button>
          <Button
            sx={{ color: 'error.main' }}
            onClick={async () => {
              setShowPasswordWarningModal(false);
              await updateOption('PasswordLoginEnabled', 'false');
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SystemSetting;
