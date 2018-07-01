# Microscope 简介

Microscope的目标是打造一个类似Etherscan的区块链数据访问平台。它提供对区块数据、交易数据、账号地址数据以及智能合约的访问等必备功能。Microscope支持多链访问，只要给出对应AppChain的RPC服务地址，即可接入这条区块链并提供数据浏览服务。AppChain运营方可以部署一个自己的专用浏览器，也可以将访问接口提供给其他浏览器。

## 多链访问

Microscope支持访问多个AppChain的数据，用户可以在Microscope的设置页面输入AppChain的json rpc地址即可切换。

## 缓存服务

缓存服务为区块链浏览器提供更好的索引性能，推荐所有的Microscope部署都同步部署一个缓存服务，以加速区块链浏览器的服务。Microscope可以在没有缓存服务的前提下正常使用大部分功能，但账户交易列表等需要扫描历史区块才能获得的服务是需要缓存服务的。

## 区块链浏览器与缓存服务搭配使用

缓存服务 agera_one repo 地址: https://github.com/Keith-CY/agera_one

### 启动服务方法: 

* 进入工程目录后执行 git clone https://github.com/Keith-CY/agera_one 获取项目
* 在工程目录下执行 cp config/dev.secret.exs.example config/dev.secret.exs 创建秘钥文件
* 修改 dev.secret.exs 中的 localhost:1337 为缓存服务器要缓存的链的地址和端口
* 在工程目录下执行 mix phx.server 进入开发模式
* 在工程目录下执行 elixir —detached -S mix phx.server 进入生产模式

浏览器 Microscope 地址: https://github.com/CITA-Toys/CITA-Toys-Wallet

### 启动服务方法:

* 进入工程目录后执行 git clone https://github.com/CITA-Toys/CITA-Toys-Wallet 获取项目
* 编辑 config/webpack.config.base.js 中 http://121.196.*.*:1337 为缓存服务器的地址和端口
* 执行 yarn add 安装依赖
* 执行 yarn start 进入开发模式
* 执行 yarn run build 将项目打包到 dists 目录下, 用 nginx 部署到服务器即可