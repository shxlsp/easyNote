## 证书问题
https://juejin.cn/post/7009179524520738824

自认证证书 - 毫无卵用
1. mac的钥匙串中新建证书，钥匙串访问->证书助理->打开，按照步骤走，创建一个证书，
2. 证书设置信任
3. 导出证书设置密码
4. 在electron-builder.json中配置
```json
  "mac": {
    "category": "public.app-category.productivity",
    "icon": "resources/img/logo.icns",
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      }
    ],
    "cscLink": "./cert/mac_private.p12",
    "cscKeyPassword": "sun123456"
  }
```