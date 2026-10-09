import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import { API, getLogo, showError, showInfo, showSuccess } from '../helpers';
import { onGitHubOAuthClicked } from './utils';
import Turnstile from 'react-turnstile';
import { Button, Card, Divider, Form, Icon, Layout, Modal } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import TelegramLoginButton from 'react-telegram-login';

import { IconGithubLogo } from '@douyinfe/semi-icons';
import WeChatIcon from './WeChatIcon';

const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  let navigate = useNavigate();
  const [status, setStatus] = useState({});
  const logo = getLogo();

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError('Not logged in or session expired, please log in again!');
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('Please retry in a few seconds, Turnstile is checking the user environment!');
      return;
    }
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
      showSuccess('Logged in successfully!');
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('Please retry in a few seconds, Turnstile is checking the user environment!');
      return;
    }
    setSubmitted(true);
    if (username && password) {
      const res = await API.post(`/api/user/login?turnstile=${turnstileToken}`, {
        username,
        password
      });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('Logged in successfully!');
        if (username === 'root' && password === '123456') {
          Modal.error({ title: 'You are using the default password!', content: 'Please change the default password immediately!', centered: true });
        }
        navigate('/token');
      } else {
        showError(message);
      }
    } else {
      showError('Please enter your username and password!');
    }
  }

  // Add Telegram login handler
  const onTelegramLoginClicked = async (response) => {
    const fields = ['id', 'first_name', 'last_name', 'username', 'photo_url', 'auth_date', 'hash', 'lang'];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) {
        params[field] = response[field];
      }
    });
    const res = await API.get(`/api/oauth/telegram/login`, { params });
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      showSuccess('Logged in successfully!');
      navigate('/');
    } else {
      showError(message);
    }
  };

  return (
    <div>
      <Layout>
        <Layout.Header>
        </Layout.Header>
        <Layout.Content>
          <div style={{ justifyContent: 'center', display: 'flex', marginTop: 120 }}>
            <div style={{ width: 500 }}>
              <Card>
                <Title heading={2} style={{ textAlign: 'center' }}>
                  User Login
                </Title>
                <Form>
                  <Form.Input
                    field={'username'}
                    label={'Username'}
                    placeholder="Username"
                    name="username"
                    onChange={(value) => handleChange('username', value)}
                  />
                  <Form.Input
                    field={'password'}
                    label={'Password'}
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={(value) => handleChange('password', value)}
                  />

                  <Button theme="solid" style={{ width: '100%' }} type={'primary'} size="large"
                          htmlType={'submit'} onClick={handleSubmit}>
                    Login
                  </Button>
                </Form>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                  <Text>
                    Don't have an account? <Link to="/register">Register</Link>
                  </Text>
                  <Text>
                    Forgot password? <Link to="/reset">Reset it</Link>
                  </Text>
                </div>
                {status.github_oauth || status.wechat_login || status.telegram_oauth ? (
                  <>
                    <Divider margin="12px" align="center">
                      Third-party login
                    </Divider>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                      {status.github_oauth ? (
                        <Button
                          type="primary"
                          icon={<IconGithubLogo />}
                          onClick={() => onGitHubOAuthClicked(status.github_client_id)}
                        />
                      ) : (
                        <></>
                      )}
                      {status.wechat_login ? (
                        <Button
                          type="primary"
                          style={{ color: 'rgba(var(--semi-green-5), 1)' }}
                          icon={<Icon svg={<WeChatIcon />} />}
                          onClick={onWeChatLoginClicked}
                        />
                      ) : (
                        <></>
                      )}

                      {status.telegram_oauth ? (
                        <TelegramLoginButton dataOnauth={onTelegramLoginClicked} botName={status.telegram_bot_name} />
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <Modal
                  title="WeChat QR code login"
                  visible={showWeChatLoginModal}
                  maskClosable={true}
                  onOk={onSubmitWeChatVerificationCode}
                  onCancel={() => setShowWeChatLoginModal(false)}
                  okText={'Login'}
                  size={'small'}
                  centered={true}
                >
                  <div style={{ display: 'flex', alignItem: 'center', flexDirection: 'column' }}>
                    <img src={status.wechat_qrcode} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>
                      Scan the QR code with WeChat to follow the official account, enter the "verification code" to get a code (valid for three minutes)
                    </p>
                  </div>
                  <Form size="large">
                    <Form.Input
                      field={'wechat_verification_code'}
                      placeholder="Verification code"
                      label={'Verification code'}
                      value={inputs.wechat_verification_code}
                      onChange={(value) => handleChange('wechat_verification_code', value)}
                    />
                  </Form>
                </Modal>
              </Card>
              {turnstileEnabled ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <Turnstile
                    sitekey={turnstileSiteKey}
                    onVerify={(token) => {
                      setTurnstileToken(token);
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

        </Layout.Content>
      </Layout>
    </div>
  );
};

export default LoginForm;
