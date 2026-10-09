<p align="right">
    <strong>English</strong> | <a href="./README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://github.com/songquanpeng/one-api"><img src="https://raw.githubusercontent.com/songquanpeng/one-api/main/web/default/public/logo.png" width="150" height="150" alt="one-api logo"></a>
</p>

<div align="center">

# One API

_✨ Access all LLMs through the standard OpenAI API format, ready to use out of the box ✨_

</div>

<p align="center">
  <a href="https://raw.githubusercontent.com/songquanpeng/one-api/main/LICENSE">
    <img src="https://img.shields.io/github/license/songquanpeng/one-api?color=brightgreen" alt="license">
  </a>
  <a href="https://github.com/songquanpeng/one-api/releases/latest">
    <img src="https://img.shields.io/github/v/release/songquanpeng/one-api?color=brightgreen&include_prereleases" alt="release">
  </a>
  <a href="https://hub.docker.com/repository/docker/justsong/one-api">
    <img src="https://img.shields.io/docker/pulls/justsong/one-api?color=brightgreen" alt="docker pull">
  </a>
  <a href="https://github.com/songquanpeng/one-api/releases/latest">
    <img src="https://img.shields.io/github/downloads/songquanpeng/one-api/total?color=brightgreen&include_prereleases" alt="release">
  </a>
  <a href="https://goreportcard.com/report/github.com/songquanpeng/one-api">
    <img src="https://goreportcard.com/badge/github.com/songquanpeng/one-api" alt="GoReportCard">
  </a>
</p>

<p align="center">
  <a href="#deployment">Deployment Tutorial</a>
  ·
  <a href="#usage">Usage</a>
  ·
  <a href="https://github.com/songquanpeng/one-api/issues">Feedback</a>
  ·
  <a href="#screenshots">Screenshots</a>
  ·
  <a href="https://openai.justsong.cn/">Live Demo</a>
  ·
  <a href="#faq">FAQ</a>
  ·
  <a href="#related-projects">Related Projects</a>
  ·
  <a href="https://iamazing.cn/page/reward">Donate</a>
</p>

> [!NOTE]
> This project is open source. Users must comply with OpenAI's [Terms of Use](https://openai.com/policies/terms-of-use) and **applicable laws and regulations**, and it must not be used for illegal purposes.

> [!NOTE]
> Stable / preview image repository: [justsong/one-api](https://hub.docker.com/repository/docker/justsong/one-api)
> or [ghcr.io/songquanpeng/one-api](https://github.com/songquanpeng/one-api/pkgs/container/one-api)
>
> alpha image repository: [justsong/one-api-alpha](https://hub.docker.com/repository/docker/justsong/one-api-alpha)
> or [ghcr.io/songquanpeng/one-api-alpha](https://github.com/songquanpeng/one-api/pkgs/container/one-api-alpha)

> [!WARNING]
> After logging in for the first time with the `root` user, be sure to change the default password `123456`!

## Features
1. Support for multiple large models:
   + [x] [OpenAI ChatGPT Series Models](https://platform.openai.com/docs/guides/gpt/chat-completions-api) (Supports [Azure OpenAI API](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference))
   + [x] [Anthropic Claude Series Models](https://anthropic.com) (Supports AWS Claude)
   + [x] [Google PaLM2 / Gemini Series Models](https://developers.generativeai.google)
   + [x] [Mistral Series Models](https://mistral.ai/)
   + [x] [ByteDance Doubao (Volcano Engine)](https://www.volcengine.com/experience/ark)
   + [x] [Baidu Wenxin Yiyuan Series Models](https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html)
   + [x] [Alibaba Tongyi Qianwen Series Models](https://help.aliyun.com/document_detail/2400395.html)
   + [x] [iFlytek Spark Cognitive Models](https://www.xfyun.cn/doc/spark/Web.html)
   + [x] [Zhipu ChatGLM Series Models](https://bigmodel.cn)
   + [x] [360 Zhibrain](https://ai.360.cn)
   + [x] [Tencent Hunyuan Models](https://cloud.tencent.com/document/product/1729)
   + [x] [Moonshot AI](https://platform.moonshot.cn/)
   + [x] [Baichuan Models](https://platform.baichuan-ai.com)
   + [x] [MiniMax](https://api.minimax.chat/)
   + [x] [Groq](https://wow.groq.com/)
   + [x] [Ollama](https://github.com/ollama/ollama)
   + [x] [01.AI](https://platform.lingyiwanwu.com/)
   + [x] [StepFun](https://platform.stepfun.com/)
   + [x] [Coze](https://www.coze.com/)
   + [x] [Cohere](https://cohere.com/)
   + [x] [DeepSeek](https://www.deepseek.com/)
   + [x] [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
   + [x] [DeepL](https://www.deepl.com/)
   + [x] [together.ai](https://www.together.ai/)
   + [x] [novita.ai](https://www.novita.ai/)
   + [x] [SiliconCloud](https://cloud.siliconflow.cn/)
   + [x] [xAI](https://x.ai/)
2. Supports configuring mirrors and many [third-party proxy services](https://iamazing.cn/page/openai-api-third-party-services).
3. Supports accessing multiple channels through **load balancing**.
4. Supports **stream mode**, enabling a typewriter effect through streaming transmission.
5. Supports **multi-machine deployment**. [See here](#multi-machine-deployment) for more details.
6. Supports **token management**, allowing you to set token expiration time, quota, allowed IP ranges, and allowed models.
7. Supports **voucher (redemption code) management**, enabling batch generation and export. Vouchers can be used to top up accounts.
8. Supports **channel management**, allowing bulk creation of channels.
9. Supports **user groups** and **channel groups**, allowing different multipliers to be set for different groups.
10. Supports configuring a **model list** per channel.
11. Supports **viewing quota details**.
12. Supports **user invite rewards**.
13. Supports displaying quota in USD.
14. Supports publishing announcements, setting top-up links, and setting initial balance for new users.
15. Supports model mapping to redirect user request models. If not necessary, please do not set it. Setting it will cause the request body to be reconstructed instead of being passed through directly, which may prevent some fields that are not yet officially supported from being transmitted.
16. Supports automatic retry on failure.
17. Supports image generation interfaces.
18. Supports [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/providers/openai/). Set the channel's proxy field to `https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY/openai`.
19. Offers rich **customization** options:
   1. Supports customizing the system name, logo, and footer.
   2. Supports customizing the homepage and about page, either with HTML & Markdown code, or by embedding a standalone webpage through an iframe.
20. Supports calling the management API through a system access token, making it possible to **extend and customize** One API without secondary development. See the [API documentation](./docs/API.md).
21. Supports Cloudflare Turnstile user verification.
22. Supports user management and **multiple login/registration methods**:
    + Email login/registration (supports email whitelist) and password reset via email.
    + [Feishu (Lark) OAuth](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/authen-v1/authorize/get).
    + [GitHub OAuth](https://github.com/settings/applications/new).
    + WeChat Official Account authorization (requires an additional deployment of [WeChat Server](https://github.com/songquanpeng/wechat-server)).
23. Supports theme switching by setting the environment variable `THEME` (defaults to `default`). PRs for more themes are welcome. See [here](./web/README.md) for details.
24. With [Message Pusher](https://github.com/songquanpeng/message-pusher), alert messages can be pushed to various apps.

## Deployment
### Docker Deployment
```shell
# Deployment command using SQLite:
docker run --name one-api -d --restart always -p 3000:3000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/one-api:/data justsong/one-api
# Deployment command using MySQL: add `-e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi"` to the command above. Modify the database connection parameters yourself; see the environment variables section below if you are unsure how.
# For example:
docker run --name one-api -d --restart always -p 3000:3000 -e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi" -e TZ=Asia/Shanghai -v /home/ubuntu/data/one-api:/data justsong/one-api
```

The first `3000` in `-p 3000:3000` is the host port and can be modified as needed.

Data and logs will be saved in the `/home/ubuntu/data/one-api` directory on the host. Please ensure the directory exists and has write permissions, or change it to a suitable directory.

If startup fails, add `--privileged=true`. See https://github.com/songquanpeng/one-api/issues/482.

If the image above cannot be pulled, try the GitHub Docker image by replacing `justsong/one-api` with `ghcr.io/songquanpeng/one-api`.

If your concurrency is high, be **sure** to set `SQL_DSN`. See the [environment variables](#environment-variables) section below.

Update command: `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower -cR`

Nginx reference configuration:
```
server{
   server_name openai.justsong.cn;  # Modify your domain name accordingly

   location / {
          client_max_body_size  64m;
          proxy_http_version 1.1;
          proxy_pass http://localhost:3000;  # Modify your port accordingly
          proxy_set_header Host $host;
          proxy_set_header X-Forwarded-For $remote_addr;
          proxy_cache_bypass $http_upgrade;
          proxy_set_header Accept-Encoding gzip;
          proxy_read_timeout 300s;  # GPT-4 requires a longer timeout; adjust as needed
   }
}
```

Then configure HTTPS with Let's Encrypt certbot:
```bash
# Install certbot on Ubuntu:
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
# Generate certificates & modify the Nginx configuration
sudo certbot --nginx
# Follow the prompts
# Restart Nginx
sudo service nginx restart
```

The initial account username is `root` and the password is `123456`.

### One-Click Deployment with Baota Panel
1. Install Baota Panel version 9.2.0 or later. Go to the [Baota Panel](https://www.bt.cn/new/download.html?r=dk_oneapi) official website and download and install the official script;
2. After installation, log in to the Baota Panel and click `Docker` in the left menu. On first entry it will prompt you to install the `Docker` service. Click install now and follow the prompts;
3. After installation, search for `One-API` in the app store, click install, configure the domain and other basic information to complete the installation.

### Docker Compose Deployment

> Only the startup method differs; the parameter settings are unchanged. Please refer to the Docker Deployment section.

```shell
# Currently supports MySQL startup, with data stored in the ./data/mysql folder
docker-compose up -d

# Check deployment status
docker-compose ps
```

### Manual Deployment
1. Download the executable file from [GitHub Releases](https://github.com/songquanpeng/one-api/releases/latest) or compile from source:
   ```shell
   git clone https://github.com/songquanpeng/one-api.git

   # Build the frontend
   cd one-api/web/default
   npm install
   npm run build

   # Build the backend
   cd ../..
   go mod download
   go build -ldflags "-s -w" -o one-api
   ```
2. Run:
   ```shell
   chmod u+x one-api
   ./one-api --port 3000 --log-dir ./logs
   ```
3. Visit [http://localhost:3000/](http://localhost:3000/) and log in. The initial account username is `root` and the password is `123456`.

For a more detailed deployment tutorial, [see here](https://iamazing.cn/page/how-to-deploy-a-website).

### Multi-machine Deployment
1. Set the same `SESSION_SECRET` value on all servers.
2. You must set `SQL_DSN` to use a MySQL database instead of SQLite. All servers connect to the same database.
3. All slave servers must set `NODE_TYPE` to `slave`; if not set, they default to master.
4. After setting `SYNC_FREQUENCY`, the server will periodically sync configurations from the database. When using a remote database, it is recommended to set this and enable Redis, regardless of master or slave.
5. Slave servers can optionally set `FRONTEND_BASE_URL` to redirect page requests to the master server.
6. Install Redis **separately** on slave servers and set `REDIS_CONN_STRING`, so that the database can be accessed with zero latency while the cache has not expired (see the environment variables description for Redis cluster or sentinel mode support).
7. If the master server also has high latency accessing the database, Redis must also be enabled and `SYNC_FREQUENCY` set, to periodically sync configurations from the database.

For details on how to use environment variables, [see here](#environment-variables).

### Baota Deployment Tutorial

See [#175](https://github.com/songquanpeng/one-api/issues/175).

If you encounter a blank page after deployment, see [#97](https://github.com/songquanpeng/one-api/issues/97).

### Deploy Third-Party Services with One API
> PRs adding more examples are welcome.

#### ChatGPT Next Web
Project homepage: https://github.com/Yidadaa/ChatGPT-Next-Web

```bash
docker run --name chat-next-web -d -p 3001:3000 yidadaa/chatgpt-next-web
```

Remember to change the port number, then set the interface address (e.g., https://openai.justsong.cn/) and API Key on the page.

#### ChatGPT Web
Project homepage: https://github.com/Chanzhaoyu/chatgpt-web

```bash
docker run --name chatgpt-web -d -p 3002:3002 -e OPENAI_API_BASE_URL=https://openai.justsong.cn -e OPENAI_API_KEY=sk-xxx chenzhaoyu94/chatgpt-web
```

Remember to change the port number, `OPENAI_API_BASE_URL`, and `OPENAI_API_KEY`.

#### QChatGPT - QQ bot
Project homepage: https://github.com/RockChinQ/QChatGPT

After completing the deployment according to the [documentation](https://qchatgpt.rockchin.top), set `requester.openai-chat-completions.base-url` in `data/provider.json` to your One API instance address, fill in the API Key in the `keys.openai` group, and set `model` to the model name you want to use.

During operation you can use the `!model` command to view and switch available models.

### Deploy to Third-Party Platforms
<details>
<summary><strong>Deploy to Sealos</strong></summary>
<div>

> Sealos servers are overseas, so no extra network handling is needed. It supports high concurrency & dynamic scaling.

Click the button below for one-click deployment (if you get a 404 after deployment, wait 3-5 minutes):

[![Deploy-on-Sealos.svg](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://cloud.sealos.io/?openapp=system-fastdeploy?templateName=one-api)

</div>
</details>

<details>
<summary><strong>Deploy to Zeabur</strong></summary>
<div>

> Zeabur servers are overseas, which automatically solves network issues, and the free quota is sufficient for personal use.

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/7Q0KO3)

1. First, fork the code.
2. Go to [Zeabur](https://zeabur.com?referralCode=songquanpeng), log in, and enter the console.
3. Create a new Project. In Service -> Add Service, select Marketplace, choose MySQL, and note down the connection parameters (username, password, address, port).
4. Copy the connection parameters and run ```create database `one-api` ``` to create the database.
5. Then in Service -> Add Service, select Git (authorization is required the first time), and choose your forked repository.
6. Deployment will start automatically; cancel it for now. Go to the Variable section below, add a `PORT` with value `3000`, then add a `SQL_DSN` with value `<username>:<password>@tcp(<addr>:<port>)/one-api`, and save. Note: if `SQL_DSN` is not set, data will not be persisted and will be lost after redeployment.
7. Select Redeploy.
8. Go to the Domains section below, choose a suitable domain prefix such as "my-one-api". The final domain will be "my-one-api.zeabur.app". You can also CNAME your own domain.
9. Wait for the deployment to complete, then click the generated domain to enter One API.

</div>
</details>

<details>
<summary><strong>Deploy to Render</strong></summary>
<div>

> Render provides a free tier, and linking a card can further increase the quota.

Render can deploy the docker image directly without forking the repository: https://dashboard.render.com

</div>
</details>

## Configuration
The system is ready to use out of the box.

You can configure it by setting environment variables or command line parameters.

After the system starts, log in with the `root` user and make further configurations.

**Note**: If you do not know the meaning of a configuration item, you can temporarily remove its value to see further hint text.

## Usage
Add your API Key on the `Channels` page, then add an access token on the `Tokens` page.

After that, you can use your token to access One API, exactly like the [OpenAI API](https://platform.openai.com/docs/api-reference/introduction).

In places that use the OpenAI API, set the API Base to your One API deployment address, e.g., `https://openai.justsong.cn`, and set the API Key to the token generated in One API.

Note that the exact API Base format depends on the client you are using.

For example, for OpenAI's official libraries:
```bash
OPENAI_API_KEY="sk-xxxxxx"
OPENAI_API_BASE="https://<HOST>:<PORT>/v1"
```

```mermaid
graph LR
    A(User)
    A --->|Request using a key distributed by One API| B(One API)
    B -->|Relay request| C(OpenAI)
    B -->|Relay request| D(Azure)
    B -->|Relay request| E(Other downstream channels in OpenAI API format)
    B -->|Relay, modify request and response body| F(Other downstream channels not in OpenAI API format)
```

To specify which channel handles the current request, you can append the channel ID to the token, e.g., `Authorization: Bearer ONE_API_KEY-CHANNEL_ID`.
Note: only tokens created by an administrator can specify a channel ID.

If no channel ID is given, load balancing will be used across multiple channels.

### Environment Variables
> One API supports reading environment variables from a `.env` file. Please refer to the `.env.example` file and rename it to `.env` when using.
1. `REDIS_CONN_STRING`: When set, Redis will be used as cache.
   + Example: `REDIS_CONN_STRING=redis://default:redispw@localhost:49153`
   + If database access latency is very low, enabling Redis is unnecessary; enabling it may actually cause data lag.
   + If you need to use sentinel or cluster mode:
     + Set this environment variable to the node list, e.g., `localhost:49153,localhost:49154,localhost:49155`.
     + In addition, set the following environment variables:
       + `REDIS_PASSWORD`: The password setting for Redis cluster or sentinel mode.
       + `REDIS_MASTER_NAME`: The name of the master node in Redis sentinel mode.
2. `SESSION_SECRET`: When set, a fixed session key will be used, so that cookies of logged-in users remain valid after the system restarts.
   + Example: `SESSION_SECRET=random_string`
3. `SQL_DSN`: When set, the specified database will be used instead of SQLite. Please use MySQL or PostgreSQL.
   + Examples:
     + MySQL: `SQL_DSN=root:123456@tcp(localhost:3306)/oneapi`
     + PostgreSQL: `SQL_DSN=postgres://postgres:123456@localhost:5432/oneapi` (in adaptation; feedback welcome)
   + Note that you need to create the database `oneapi` in advance. No manual table creation is needed; the program will create tables automatically.
   + If using a local database: you can add `--network="host"` to the deployment command so that the program inside the container can access MySQL on the host.
   + If using a cloud database: if the cloud server requires identity verification, add `?tls=skip-verify` to the connection parameters.
   + Modify the following parameters according to your database configuration (or keep the defaults):
     + `SQL_MAX_IDLE_CONNS`: Maximum number of idle connections, default `100`.
     + `SQL_MAX_OPEN_CONNS`: Maximum number of open connections, default `1000`.
       + If you get the error `Error 1040: Too many connections`, reduce this value appropriately.
     + `SQL_CONN_MAX_LIFETIME`: Maximum connection lifetime, default `60` minutes.
4. `LOG_SQL_DSN`: When set, a separate database will be used for the `logs` table; please use MySQL or PostgreSQL.
5. `FRONTEND_BASE_URL`: When set, page requests will be redirected to the specified address. Only set on slave servers.
   + Example: `FRONTEND_BASE_URL=https://openai.justsong.cn`
6. `MEMORY_CACHE_ENABLED`: Enabling memory cache will cause a certain delay in updating user quotas. Valid values are `true` and `false`; defaults to `false` if not set.
   + Example: `MEMORY_CACHE_ENABLED=true`
7. `SYNC_FREQUENCY`: The frequency of syncing configurations with the database when caching is enabled, in seconds; defaults to `600`.
   + Example: `SYNC_FREQUENCY=60`
8. `NODE_TYPE`: When set, specifies the node type. Valid values are `master` and `slave`; defaults to `master` if not set.
   + Example: `NODE_TYPE=slave`
9. `CHANNEL_UPDATE_FREQUENCY`: When set, channel balances will be updated periodically, in minutes; if not set, no update happens.
   + Example: `CHANNEL_UPDATE_FREQUENCY=1440`
10. `CHANNEL_TEST_FREQUENCY`: When set, channels will be tested periodically, in minutes; if not set, no testing happens.
    + Example: `CHANNEL_TEST_FREQUENCY=1440`
11. `POLLING_INTERVAL`: The request interval when batch-updating channel balances and testing availability, in seconds; no interval by default.
    + Example: `POLLING_INTERVAL=5`
12. `BATCH_UPDATE_ENABLED`: Enabling batch database update aggregation will cause a certain delay in updating user quotas. Valid values are `true` and `false`; defaults to `false` if not set.
    + Example: `BATCH_UPDATE_ENABLED=true`
    + If you encounter too many database connections, you can try enabling this option.
13. `BATCH_UPDATE_INTERVAL`: The time interval for batch update aggregation, in seconds; defaults to `5`.
    + Example: `BATCH_UPDATE_INTERVAL=5`
14. Request rate limiting:
    + `GLOBAL_API_RATE_LIMIT`: Global API rate limit (excluding relay requests); the maximum number of requests per IP within three minutes, defaults to `180`.
    + `GLOBAL_WEB_RATE_LIMIT`: Global web rate limit; the maximum number of requests per IP within three minutes, defaults to `60`.
15. Encoder cache settings:
    + `TIKTOKEN_CACHE_DIR`: By default, the program downloads the encodings of some common tokens (e.g., `gpt-3.5-turbo`) from the internet at startup. In unstable network environments or offline situations, this may cause startup issues. This directory can be configured to cache data and can be migrated to an offline environment.
    + `DATA_GYM_CACHE_DIR`: Currently has the same effect as `TIKTOKEN_CACHE_DIR`, but with lower priority.
16. `RELAY_TIMEOUT`: Relay timeout setting, in seconds; no timeout by default.
17. `RELAY_PROXY`: When set, this proxy is used to request APIs.
18. `USER_CONTENT_REQUEST_TIMEOUT`: The timeout for downloading user-uploaded content, in seconds.
19. `USER_CONTENT_REQUEST_PROXY`: When set, this proxy is used to request user-uploaded content, such as images.
20. `SQLITE_BUSY_TIMEOUT`: SQLite lock wait timeout, in milliseconds; defaults to `3000`.
21. `GEMINI_SAFETY_SETTING`: Gemini safety settings; defaults to `BLOCK_NONE`.
22. `GEMINI_VERSION`: The Gemini version used by One API; defaults to `v1`.
23. `THEME`: The system's theme setting; defaults to `default`. See [here](./web/README.md) for the available values.
24. `ENABLE_METRIC`: Whether to disable channels based on request success rate; disabled by default. Valid values are `true` and `false`.
25. `METRIC_QUEUE_SIZE`: The request success rate statistics queue size; defaults to `10`.
26. `METRIC_SUCCESS_RATE_THRESHOLD`: The request success rate threshold; defaults to `0.8`.
27. `INITIAL_ROOT_TOKEN`: If set, a root user token with this value will be automatically created on the first system startup.
28. `INITIAL_ROOT_ACCESS_TOKEN`: If set, a system management token with this value will be automatically created for the root user on the first system startup.
29. `ENFORCE_INCLUDE_USAGE`: Whether to force returning `usage` in stream mode; disabled by default. Valid values are `true` and `false`.
30. `TEST_PROMPT`: The user prompt used when testing models; defaults to `Print your model name exactly and do not output without any other text.`

### Command Line Parameters
1. `--port <port_number>`: Specifies the port number the server listens on; defaults to `3000`.
   + Example: `--port 3000`
2. `--log-dir <log_dir>`: Specifies the log directory. If not set, logs are saved in the `logs` folder of the working directory by default.
   + Example: `--log-dir ./logs`
3. `--version`: Prints the system version number and exits.
4. `--help`: Displays command usage help and parameter descriptions.

## Demo
### Online Demo
Note: this demo site does not provide external services:
https://openai.justsong.cn

### Screenshots
![channel](https://user-images.githubusercontent.com/39998050/233837954-ae6683aa-5c4f-429f-a949-6645a83c9490.png)
![token](https://user-images.githubusercontent.com/39998050/233837971-dab488b7-6d96-43af-b640-a168e8d1c9bf.png)

## FAQ
1. What is quota? How is it calculated? Does One API have quota calculation issues?
   + Quota = group multiplier * model multiplier * (number of prompt tokens + number of completion tokens * completion multiplier)
   + The completion multiplier is fixed at 1.33 for GPT3.5 and 2 for GPT4, consistent with the official definitions.
   + In non-stream mode, the official API returns the total tokens consumed, but note that the consumption multipliers for prompts and completions differ.
   + Note: One API's default multipliers are the official multipliers and have already been adjusted.
2. Why does it prompt "insufficient quota" even though my account balance is sufficient?
   + Please check if your token quota is sufficient. It is separate from the account balance.
   + The token quota is only used to set the maximum usage and can be freely set by the user.
3. It says "No available channels"?
   + Please check the user group and channel group settings.
   + Also check the channel's model settings.
4. Channel testing reports an error: `invalid character '<' looking for beginning of value`
   + This is because the returned value is not valid JSON but an HTML page.
   + Most likely, the IP of your deployment site or the node of your proxy has been blocked by CloudFlare.
5. ChatGPT Next Web reports an error: `Failed to fetch`
   + Do not set `BASE_URL` during deployment.
   + Check whether your interface address and API Key are correct.
   + Check whether HTTPS is enabled; browsers will block HTTP requests under an HTTPS domain.
6. Error: `The current group load is saturated, please try again later`
   + The upstream channel returned 429.
7. Will my data be lost after upgrading?
   + If using MySQL, no.
   + If using SQLite, you must follow the deployment command I provided and mount a volume to persist the one-api.db database file; otherwise the data will be lost after the container restarts.
8. Do I need to make any database changes before upgrading?
   + Generally no; the system will adjust automatically during initialization.
   + If needed, I will describe it in the changelog and provide a script.
9. After manually modifying the database, it reports an error: `Database consistency has been broken, please contact the administrator`?
   + This is because some records in the ability table have channel IDs that do not exist, most likely because you deleted records from the channel table without cleaning up the invalid channels in the ability table.
   + For each channel, each supported model needs a dedicated record in the ability table, indicating that the channel supports that model.

## Related Projects
* [FastGPT](https://github.com/labring/FastGPT): Knowledge question answering system based on LLMs
* [ChatGPT Next Web](https://github.com/Yidadaa/ChatGPT-Next-Web): One-click deployment of your own cross-platform ChatGPT application
* [VChart](https://github.com/VisActor/VChart): Not just a ready-to-use cross-platform charting library, but also a vivid and flexible data storyteller.
* [VMind](https://github.com/VisActor/VMind): Not just automatic, but also smart. An open-source intelligent visualization solution.
* [CherryStudio](https://github.com/CherryHQ/cherry-studio): A cross-platform AI client with multi-provider integration management and local knowledge base support.

## Note

This project is released under the MIT license. **On this basis**, the attribution and a link to this project must be retained at the bottom of the page. If you do not wish to keep the attribution, you must first obtain authorization.

The same applies to derivative projects based on this project.

According to the MIT license, users must bear the risk and responsibility of using this project, and the developer of this open-source project is not responsible for it.
