import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Grid, Header, Modal, Message } from 'semantic-ui-react';
import { API, removeTrailingSlash, showError } from '../helpers';

const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    PasswordRegisterEnabled: '',
    EmailVerificationEnabled: '',
    GitHubOAuthEnabled: '',
    GitHubClientId: '',
    GitHubClientSecret: '',
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
    MessagePusherAddress: '',
    MessagePusherToken: '',
    TurnstileCheckEnabled: '',
    TurnstileSiteKey: '',
    TurnstileSecretKey: '',
    RegisterEnabled: '',
    EmailDomainRestrictionEnabled: '',
    EmailDomainWhitelist: ''
  });
  const [originInputs, setOriginInputs] = useState({});
  let [loading, setLoading] = useState(false);
  const [EmailDomainWhitelist, setEmailDomainWhitelist] = useState([]);
  const [restrictedDomainInput, setRestrictedDomainInput] = useState('');
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

      setEmailDomainWhitelist(newInputs.EmailDomainWhitelist.split(',').map((item) => {
        return { key: item, text: item, value: item };
      }));
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
        ...inputs, [key]: value
      }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (e, { name, value }) => {
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
      name === 'EmailDomainWhitelist'
    ) {
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
    if (
      originInputs['SMTPPort'] !== inputs.SMTPPort &&
      inputs.SMTPPort !== ''
    ) {
      await updateOption('SMTPPort', inputs.SMTPPort);
    }
    if (
      originInputs['SMTPToken'] !== inputs.SMTPToken &&
      inputs.SMTPToken !== ''
    ) {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };


  const submitEmailDomainWhitelist = async () => {
    if (
      originInputs['EmailDomainWhitelist'] !== inputs.EmailDomainWhitelist.join(',') &&
      inputs.SMTPToken !== ''
    ) {
      await updateOption('EmailDomainWhitelist', inputs.EmailDomainWhitelist.join(','));
    }
  };

  const submitWeChat = async () => {
    if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
      await updateOption(
        'WeChatServerAddress',
        removeTrailingSlash(inputs.WeChatServerAddress)
      );
    }
    if (
      originInputs['WeChatAccountQRCodeImageURL'] !==
      inputs.WeChatAccountQRCodeImageURL
    ) {
      await updateOption(
        'WeChatAccountQRCodeImageURL',
        inputs.WeChatAccountQRCodeImageURL
      );
    }
    if (
      originInputs['WeChatServerToken'] !== inputs.WeChatServerToken &&
      inputs.WeChatServerToken !== ''
    ) {
      await updateOption('WeChatServerToken', inputs.WeChatServerToken);
    }
  };

  const submitMessagePusher = async () => {
    if (originInputs['MessagePusherAddress'] !== inputs.MessagePusherAddress) {
      await updateOption(
        'MessagePusherAddress',
        removeTrailingSlash(inputs.MessagePusherAddress)
      );
    }
    if (
      originInputs['MessagePusherToken'] !== inputs.MessagePusherToken &&
      inputs.MessagePusherToken !== ''
    ) {
      await updateOption('MessagePusherToken', inputs.MessagePusherToken);
    }
  };

  const submitGitHubOAuth = async () => {
    if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
      await updateOption('GitHubClientId', inputs.GitHubClientId);
    }
    if (
      originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret &&
      inputs.GitHubClientSecret !== ''
    ) {
      await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
    }
  };

  const submitTurnstile = async () => {
    if (originInputs['TurnstileSiteKey'] !== inputs.TurnstileSiteKey) {
      await updateOption('TurnstileSiteKey', inputs.TurnstileSiteKey);
    }
    if (
      originInputs['TurnstileSecretKey'] !== inputs.TurnstileSecretKey &&
      inputs.TurnstileSecretKey !== ''
    ) {
      await updateOption('TurnstileSecretKey', inputs.TurnstileSecretKey);
    }
  };

  const submitNewRestrictedDomain = () => {
    const localDomainList = inputs.EmailDomainWhitelist;
    if (restrictedDomainInput !== '' && !localDomainList.includes(restrictedDomainInput)) {
      setRestrictedDomainInput('');
      setInputs({
        ...inputs,
        EmailDomainWhitelist: [...localDomainList, restrictedDomainInput],
      });
      setEmailDomainWhitelist([...EmailDomainWhitelist, {
        key: restrictedDomainInput,
        text: restrictedDomainInput,
        value: restrictedDomainInput,
      }]);
    }
  }

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form loading={loading}>
          <Header as='h3'>General Settings</Header>
          <Form.Group widths='equal'>
            <Form.Input
              label='Server Address'
              placeholder='e.g., https://yourdomain.com'
              value={inputs.ServerAddress}
              name='ServerAddress'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitServerAddress}>
            Update Server Address
          </Form.Button>
          <Divider />
          <Header as='h3'>Configure Login & Registration</Header>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.PasswordLoginEnabled === 'true'}
              label='Allow password login'
              name='PasswordLoginEnabled'
              onChange={handleInputChange}
            />
            {
              showPasswordWarningModal &&
              <Modal
                open={showPasswordWarningModal}
                onClose={() => setShowPasswordWarningModal(false)}
                size={'tiny'}
                style={{ maxWidth: '450px' }}
              >
                <Modal.Header>Warning</Modal.Header>
                <Modal.Content>
                  <p>Disabling password login will prevent all users who have not bound other login methods (including administrators) from logging in via password. Confirm?</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={() => setShowPasswordWarningModal(false)}>Cancel</Button>
                  <Button
                    color='yellow'
                    onClick={async () => {
                      setShowPasswordWarningModal(false);
                      await updateOption('PasswordLoginEnabled', 'false');
                    }}
                  >
                    Confirm
                  </Button>
                </Modal.Actions>
              </Modal>
            }
            <Form.Checkbox
              checked={inputs.PasswordRegisterEnabled === 'true'}
              label='Allow password registration'
              name='PasswordRegisterEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.EmailVerificationEnabled === 'true'}
              label='Require email verification when registering with password'
              name='EmailVerificationEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.GitHubOAuthEnabled === 'true'}
              label='Allow login & registration via GitHub account'
              name='GitHubOAuthEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.WeChatAuthEnabled === 'true'}
              label='Allow login & registration via WeChat'
              name='WeChatAuthEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.RegisterEnabled === 'true'}
              label='Allow new user registration (when disabled, new users cannot register by any means)'
              name='RegisterEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.TurnstileCheckEnabled === 'true'}
              label='Enable Turnstile user verification'
              name='TurnstileCheckEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Divider />
          <Header as='h3'>
            Configure Email Domain Whitelist
            <Header.Subheader>To prevent malicious users from mass-registering using temporary email addresses</Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Checkbox
              label='Enable email domain whitelist'
              name='EmailDomainRestrictionEnabled'
              onChange={handleInputChange}
              checked={inputs.EmailDomainRestrictionEnabled === 'true'}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Dropdown
              label='Allowed Email Domains'
              placeholder='Allowed email domains'
              name='EmailDomainWhitelist'
              required
              fluid
              multiple
              selection
              onChange={handleInputChange}
              value={inputs.EmailDomainWhitelist}
              autoComplete='new-password'
              options={EmailDomainWhitelist}
            />
            <Form.Input
              label='Add a new allowed email domain'
              action={
                <Button type='button' onClick={() => {
                  submitNewRestrictedDomain();
                }}>Add</Button>
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitNewRestrictedDomain();
                }
              }}
              autoComplete='new-password'
              placeholder='Enter a new allowed email domain'
              value={restrictedDomainInput}
              onChange={(e, { value }) => {
                setRestrictedDomainInput(value);
              }}
            />
          </Form.Group>
          <Form.Button onClick={submitEmailDomainWhitelist}>Save Email Domain Whitelist Settings</Form.Button>
          <Divider />
          <Header as='h3'>
            Configure SMTP
            <Header.Subheader>To support the system email sending</Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='SMTP Server Address'
              name='SMTPServer'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPServer}
              placeholder='e.g., smtp.qq.com'
            />
            <Form.Input
              label='SMTP Port'
              name='SMTPPort'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPPort}
              placeholder='Default: 587'
            />
            <Form.Input
              label='SMTP Account'
              name='SMTPAccount'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPAccount}
              placeholder='Usually an email address'
            />
          </Form.Group>
          <Form.Group widths={3}>
            <Form.Input
              label='SMTP Sender Email'
              name='SMTPFrom'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPFrom}
              placeholder='Usually consistent with the email address'
            />
            <Form.Input
              label='SMTP Access Token'
              name='SMTPToken'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              checked={inputs.RegisterEnabled === 'true'}
              placeholder='Sensitive information will not be sent to the frontend for display'
            />
          </Form.Group>
          <Form.Button onClick={submitSMTP}>Save SMTP Settings</Form.Button>
          <Divider />
          <Header as='h3'>
            Configure GitHub OAuth App
            <Header.Subheader>
              To support login and registration via GitHub,
              <a href='https://github.com/settings/developers' target='_blank'>
                Click here
              </a>
              to manage your GitHub OAuth App
            </Header.Subheader>
          </Header>
          <Message>
            Set Homepage URL to <code>{inputs.ServerAddress}</code>
            , and Authorization callback URL to{' '}
            <code>{`${inputs.ServerAddress}/oauth/github`}</code>
          </Message>
          <Form.Group widths={3}>
            <Form.Input
              label='GitHub Client ID'
              name='GitHubClientId'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.GitHubClientId}
              placeholder='Enter the ID of your registered GitHub OAuth App'
            />
            <Form.Input
              label='GitHub Client Secret'
              name='GitHubClientSecret'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              value={inputs.GitHubClientSecret}
              placeholder='Sensitive information will not be sent to the frontend for display'
            />
          </Form.Group>
          <Form.Button onClick={submitGitHubOAuth}>
            Save GitHub OAuth Settings
          </Form.Button>
          <Divider />
          <Header as='h3'>
            Configure WeChat Server
            <Header.Subheader>
              To support login and registration via WeChat,
              <a
                href='https://github.com/songquanpeng/wechat-server'
                target='_blank'
              >
                Click here
              </a>
              to learn about WeChat Server
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='WeChat Server Address'
              name='WeChatServerAddress'
              placeholder='e.g., https://yourdomain.com'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.WeChatServerAddress}
            />
            <Form.Input
              label='WeChat Server Access Token'
              name='WeChatServerToken'
              type='password'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.WeChatServerToken}
              placeholder='Sensitive information will not be sent to the frontend for display'
            />
            <Form.Input
              label='WeChat Official Account QR Code Image URL'
              name='WeChatAccountQRCodeImageURL'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.WeChatAccountQRCodeImageURL}
              placeholder='Enter an image link'
            />
          </Form.Group>
          <Form.Button onClick={submitWeChat}>
            Save WeChat Server Settings
          </Form.Button>
          <Divider />
          <Header as='h3'>
            Configure Message Pusher
            <Header.Subheader>
              To push alert information,
              <a
                href='https://github.com/songquanpeng/message-pusher'
                target='_blank'
              >
                Click here
              </a>
              to learn about Message Pusher
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='Message Pusher Address'
              name='MessagePusherAddress'
              placeholder='e.g., https://msgpusher.com/push/your_username'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.MessagePusherAddress}
            />
            <Form.Input
              label='Message Pusher Access Token'
              name='MessagePusherToken'
              type='password'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.MessagePusherToken}
              placeholder='Sensitive information will not be sent to the frontend for display'
            />
          </Form.Group>
          <Form.Button onClick={submitMessagePusher}>
            Save Message Pusher Settings
          </Form.Button>
          <Divider />
          <Header as='h3'>
            Configure Turnstile
            <Header.Subheader>
              To support user verification,
              <a href='https://dash.cloudflare.com/' target='_blank'>
                Click here
              </a>
              to manage your Turnstile Sites. It is recommended to choose Invisible Widget Type
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='Turnstile Site Key'
              name='TurnstileSiteKey'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.TurnstileSiteKey}
              placeholder='Enter the Turnstile Site Key you registered'
            />
            <Form.Input
              label='Turnstile Secret Key'
              name='TurnstileSecretKey'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              value={inputs.TurnstileSecretKey}
              placeholder='Sensitive information will not be sent to the frontend for display'
            />
          </Form.Group>
          <Form.Button onClick={submitTurnstile}>
            Save Turnstile Settings
          </Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default SystemSetting;
