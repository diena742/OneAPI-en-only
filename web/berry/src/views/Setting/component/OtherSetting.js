import { useState, useEffect } from 'react';
import SubCard from 'ui-component/cards/SubCard';
import {
    Stack,
    FormControl,
    InputLabel,
    OutlinedInput,
    Button,
    Alert,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Divider, Link
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { showError, showSuccess } from 'utils/common'; //,
import { API } from 'utils/api';
import { marked } from 'marked';

const OtherSetting = () => {
  let [inputs, setInputs] = useState({
    Footer: '',
    Notice: '',
    About: '',
    SystemName: '',
    Logo: '',
    HomePageContent: '',
    Theme: '',
  });
  let [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    tag_name: '',
    content: ''
  });

  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        if (item.key in inputs) {
          newInputs[item.key] = item.value;
        }
      });
      setInputs(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    const res = await API.put('/api/option/', {
      key,
      value
    });
    const { success, message } = res.data;
    if (success) {
      setInputs((inputs) => ({ ...inputs, [key]: value }));
      showSuccess('Saved successfully');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    let { name, value } = event.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const submitNotice = async () => {
    await updateOption('Notice', inputs.Notice);
  };

  const submitFooter = async () => {
    await updateOption('Footer', inputs.Footer);
  };

  const submitSystemName = async () => {
    await updateOption('SystemName', inputs.SystemName);
  };

  const submitTheme = async () => {
    await updateOption('Theme', inputs.Theme);
  };

  const submitLogo = async () => {
    await updateOption('Logo', inputs.Logo);
  };

  const submitAbout = async () => {
    await updateOption('About', inputs.About);
  };

  const submitOption = async (key) => {
    await updateOption(key, inputs[key]);
  };

  const openGitHubRelease = () => {
    window.location = 'https://github.com/songquanpeng/one-api/releases/latest';
  };

  const checkUpdate = async () => {
    const res = await API.get('https://api.github.com/repos/songquanpeng/one-api/releases/latest');
    const { tag_name, body } = res.data;
    if (tag_name === process.env.REACT_APP_VERSION) {
      showSuccess(`Already the latest version: ${tag_name}`);
    } else {
      setUpdateData({
        tag_name: tag_name,
        content: marked.parse(body)
      });
      setShowUpdateModal(true);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <SubCard title="General Settings">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <Button variant="contained" onClick={checkUpdate}>
                Check for Updates
              </Button>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField
                  multiline
                  maxRows={15}
                  id="Notice"
                  label="Notice"
                  value={inputs.Notice}
                  name="Notice"
                  onChange={handleInputChange}
                  minRows={10}
                  placeholder="Enter new notice content here. Supports Markdown & HTML code"
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitNotice}>
                Save Notice
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="Personalization Settings">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SystemName">System Name</InputLabel>
                <OutlinedInput
                  id="SystemName"
                  name="SystemName"
                  value={inputs.SystemName || ''}
                  onChange={handleInputChange}
                  label="System Name"
                  placeholder="Enter the system name here"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitSystemName}>
                Set System Name
              </Button>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="Theme">Theme Name</InputLabel>
                <OutlinedInput
                    id="Theme"
                    name="Theme"
                    value={inputs.Theme || ''}
                    onChange={handleInputChange}
                    label="Theme Name"
                    placeholder="Please enter the theme name"
                    disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitTheme}>
                Set Theme (takes effect after restart)
              </Button>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="Logo">Logo Image URL</InputLabel>
                <OutlinedInput
                  id="Logo"
                  name="Logo"
                  value={inputs.Logo || ''}
                  onChange={handleInputChange}
                  label="Logo Image URL"
                  placeholder="Enter the Logo image URL here"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitLogo}>
                Set Logo
              </Button>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField
                  multiline
                  maxRows={15}
                  id="HomePageContent"
                  label="Homepage Content"
                  value={inputs.HomePageContent}
                  name="HomePageContent"
                  onChange={handleInputChange}
                  minRows={10}
                  placeholder="Enter homepage content here. Supports Markdown & HTML code. After setting, the homepage status information will no longer be displayed. If you enter a link, it will be used as the src attribute of an iframe, allowing you to set any webpage as the homepage."
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={() => submitOption('HomePageContent')}>
                Save Homepage Content
              </Button>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField
                  multiline
                  maxRows={15}
                  id="About"
                  label="About"
                  value={inputs.About}
                  name="About"
                  onChange={handleInputChange}
                  minRows={10}
                  placeholder="Enter new about content here. Supports Markdown & HTML code. If you enter a link, it will be used as the src attribute of an iframe, allowing you to set any webpage as the about page."
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitAbout}>
                Save About
              </Button>
            </Grid>
            <Grid xs={12}>
              <Alert severity="warning">
                Removing One API's copyright notice requires authorization first. Maintaining this project takes a lot of effort. If this project is meaningful to you, please support it proactively.
              </Alert>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField
                  multiline
                  maxRows={15}
                  id="Footer"
                  label="Footer"
                  value={inputs.Footer}
                  name="Footer"
                  onChange={handleInputChange}
                  minRows={10}
                  placeholder="Enter a new footer here. Leave empty to use the default footer. Supports HTML code"
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitFooter}>
                Set Footer
              </Button>
            </Grid>
          </Grid>
        </SubCard>
      </Stack>
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)} fullWidth maxWidth={'md'}>
        <DialogTitle sx={{ margin: '0px', fontWeight: 700, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
          New Version: {updateData.tag_name}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {' '}
          <div dangerouslySetInnerHTML={{ __html: updateData.content }}></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button
            onClick={async () => {
              setShowUpdateModal(false);
              openGitHubRelease();
            }}
          >
            View on GitHub
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OtherSetting;
