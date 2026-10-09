# One API Frontend

> Each folder represents a theme. Pull requests for new themes are welcome.

> [!WARNING]
> Not every theme is kept in sync with all features. Due to limited resources, the default theme is updated first. Pull requests for other themes are welcome & expected.

## Submitting a New Theme

> Feel free to keep your copyright notice and a link back to you and One API at the bottom of the page.

1. Create a new folder under the `web` folder, named after the theme.
2. Put your theme files into this folder.
3. Modify your `package.json` file and change the `build` command to: `"build": "react-scripts build && mv -f build ../build/default"`, where `default` is your theme name.
4. Modify `ValidThemes` in `common/config/config.go` and register your theme name.
5. Modify the `web/THEMES` file. This also needs to be updated in sync.

## Theme List

### Theme: default

The default theme, developed by [JustSong](https://github.com/songquanpeng).

Preview:
|![image](https://github.com/songquanpeng/one-api/assets/39998050/ccfbc668-3a7f-4bc1-87da-7eacfd7bf371)|![image](https://github.com/songquanpeng/one-api/assets/39998050/a63ed547-44b9-45db-b43a-ecea07d60840)|
|:---:|:---:|

### Theme: berry

Developed by [MartialBE](https://github.com/MartialBE).

Preview:
|||
|:---:|:---:|
|![image](https://github.com/songquanpeng/one-api/assets/42402987/36aff5c6-c5ff-4a90-8e3d-33d5cff34cbf)|![image](https://github.com/songquanpeng/one-api/assets/42402987/9ac63b36-5140-4064-8fad-fc9d25821509)|
|![image](https://github.com/songquanpeng/one-api/assets/42402987/fb2b1c64-ef24-4027-9b80-0cd9d945a47f)|![image](https://github.com/songquanpeng/one-api/assets/42402987/b6b649ec-2888-4324-8b2d-d5e11554eed6)|
|![image](https://github.com/songquanpeng/one-api/assets/42402987/6d3b22e0-436b-4e26-8911-bcc993c6a2bd)|![image](https://github.com/songquanpeng/one-api/assets/42402987/eef1e224-7245-44d7-804e-9d1c8fa3f29c)|

### Theme: air
Developed by [Calon](https://github.com/Calcium-Ion).
|![image](https://github.com/songquanpeng/songquanpeng.github.io/assets/39998050/1ddb274b-a715-4e81-858b-857d520b6ff4)|![image](https://github.com/songquanpeng/songquanpeng.github.io/assets/39998050/163b0b8e-1f73-49cb-b632-3dcb986b56d5)|
|:---:|:---:|


#### Development Notes

See [web/berry/README.md](https://github.com/songquanpeng/one-api/tree/main/web/berry/README.md)
