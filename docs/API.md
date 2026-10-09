# Use the API to Control & Extend One API
> Welcome to submit a PR to showcase your extension project here.

For example, although One API does not natively support payments, you can implement payment functionality through the system's extension APIs.

Alternatively, if you want to customize your channel management strategy, you can use the API to disable and enable channels.

## Authentication
One API supports two authentication methods: Cookie and Token. For Token, obtain it as shown in the figure below:

![image](https://github.com/songquanpeng/songquanpeng.github.io/assets/39998050/c15281a7-83ed-47cb-a1f6-913cb6bf4a7c)

Afterwards, use the Token as the value of the Authorization field in the request header. For example, the following uses a Token to call the API for testing a channel:
![image](https://github.com/songquanpeng/songquanpeng.github.io/assets/39998050/1273b7ae-cb60-4c0d-93a6-b1cbc039c4f8)

## Request and Response Format
One API uses JSON format for requests and responses.

For response bodies, the general format is as follows:
```json
{
  "message": "Request information",
  "success": true,
  "data": {}
}
```

## API List
> The current API list is incomplete; please capture frontend requests through your browser yourself.

If the existing APIs cannot meet your needs, feel free to submit an issue for discussion.

### Get current logged-in user information
**GET** `/api/user/self`

### Recharge quota for a given user
**POST** `/api/topup`
```json
{
  "user_id": 1,
  "quota": 100000,
  "remark": "Recharge 100000 quota"
}
```

## Other
### Additional parameters on the recharge link
One API appends the user's information and recharge details to the link when the user clicks the recharge button, for example:
`https://example.com?username=root&user_id=1&transaction_id=4b3eed80-55d5-443f-bd44-fb18c648c837`

You can parse the parameters in the link to obtain user and recharge information, then call the API to recharge the user.

Note that not all themes support this feature; PRs are welcome to add support.