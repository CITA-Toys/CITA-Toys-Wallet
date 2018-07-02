# Microscope 简介

[Microscope](https://github.com/cryptape/Microscope) 是一款功能完备的区块链数据访问平台。

通过 Microscope 您可以访问指定 AppChain 上的区块, 交易, 账号(含合约) 数据, 对合约执行 Call 调用, 以及查看 AppChain 实时性能.

登录 Microscope, 默认访问我们的体验 AppChain, 如果要切换至您关注的 AppChain, 只需点击 Microscope 右上角状态区的链名(默认为 test-chain), 在呼出的侧边栏中输入指定 AppChain 的地址及端口即可.

AppChain 的每一个运营者都可以部署一个自己专用的 Microscope 用于更好的展示数据.

---

## AppChain 链切换

Microscope 支持多条 AppChain 之间的切换, 用户只需要点击右上角 `链名称`, 在呼出的侧边栏中输入指定 AppChain 的地址及端口号即可完成 Microscope 数据源的切换.

---

## 索引及统计功能

要实现 AppChain 上索引及统计功能, 需要加入相应链的缓存服务 AgeraONE[https://github.com/Keith-CY/agera_one].

基于 AgeraONE, Microscope 可以实现区块 , 交易的索引及 AppChain 性能的评估.

---

## Microscope 二次开发方法:

- 进入工程目录后执行 `git clone https://github.com/cryptape/Microscope` 获取项目

- 编辑 `config/webpack.config.base.js` 中 `http://121.196.*.*:1337` 为缓存服务器的地址和端口

- 执行 `yarn add` 安装依赖

- 执行 `yarn run dll` 打包动态依赖

- 执行 `yarn start` 进入开发模式

- 执行 `yarn run build` 将项目打包到 `dist` 目录下, 用 `nginx` 部署到服务器即可

---

## AgeraONE 二次开发方法:

- 进入工程目录后执行 `git clone https://github.com/Keith-CY/agera_one` 获取项目

- 在工程目录下执行 `cp config/dev.secret.exs.example config/dev.secret.exs` 创建秘钥文件

- 修改 `dev.secret.exs` 中的 `localhost:1337` 为缓存服务器要缓存的链的地址和端口

-  执行 `mix ecto:migrate` 配置数据库

- 在工程目录下执行 `mix phx.server` 进入开发模式

- 在工程目录下执行 `elixir —detached -S mix phx.server` 进入生产模式
