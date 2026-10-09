# One API Frontend

This project is the frontend of One API, developed based on [Berry Free React Admin Template](https://github.com/codedthemes/berry-free-react-admin-template).

## Open Source Projects Used

The following open source projects are used as part of our project:

- [Berry Free React Admin Template](https://github.com/codedthemes/berry-free-react-admin-template)
- [minimal-ui-kit](minimal-ui-kit)

## Development Notes

When adding a new channel, the following places need to be modified:

1. `web/berry/src/constants/ChannelConstants.js`

Add the new channel to `CHANNEL_OPTIONS` in this file.

```js
export const CHANNEL_OPTIONS = {
  //key is the channel ID
  1: {
    key: 1, // Channel ID
    text: "OpenAI", // Channel name
    value: 1, // Channel ID
    color: "primary", // Color displayed in the channel list
  },
};
```

2. `web/berry/src/views/Channel/type/Config.js`

Add the new channel configuration to `typeConfig` in this file. If no configuration is needed, it can be omitted.

```js
const typeConfig = {
  // key is the channel ID
  3: {
    inputLabel: {
      // Input field name configuration
      // Corresponding field name
      base_url: "AZURE_OPENAI_ENDPOINT",
      other: "Default API version",
    },
    prompt: {
      // Input field placeholder configuration
      // Corresponding field name
      base_url: "Please fill in AZURE_OPENAI_ENDPOINT",

      // Note: Whether the `other` input field is shown is determined by whether `other` has a value. By default it has no value.
      other: "Please enter the default API version, e.g., 2024-03-01-preview",
    },
    modelGroup: "openai", // Model group name. This value is used by the "Fill in channel supported models" button, which fetches the model group based on this value. If left blank, the default is openai
  },
};
```

## License

The code used in this project is licensed under the MIT License.
