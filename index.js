#!/usr/bin/env node

var shell = require("shelljs");
const inquirer = require("inquirer");
const os = require("os");
const program = require("commander");
const { version } = require("./package.json");

//打印版本号
console.log(`webserver-cli v${version}`);

// 获取所有网络接口的信息(11)
const networkInterfaces = os.networkInterfaces();
let ipAddress = [];
Object.keys(networkInterfaces).forEach((interfaceName) => {
  const interfaces = networkInterfaces[interfaceName];
  // 遍历每个网络接口下的IPv4地址
  for (let i = 0; i < interfaces.length; i++) {
    if (!interfaces[i].internal && interfaces[i].family === "IPv4") {
      ipAddress.push(interfaces[i].address);
    }
  }
});

const currentIp = ipAddress[0];
console.log(`本机所有的IP地址(ipv4)：\n${ipAddress.join("\n")}`);

const question = [
  {
    type: "input",
    message: "需要启动的ip地址",
    name: "ip",
    default: currentIp,
  },
  {
    type: "input",
    message: "设定端口号",
    name: "port",
    default: "8888",
  },
];

program
  .description("在当前目录,启动本地WebServer服务, control + c 停止服务")
  .action(function () {
    inquirer.prompt(question).then((answer) => {
      const ip = answer.ip;
      const port = answer.port;
      if (ip.length > 0 && port.length > 0) {
        var pwdDir = shell.exec("pwd", {
          silent: true,
        }).stdout;
        console.log("当前目录: ", pwdDir);
        console.log(`服务已启动: http://${ip}:${port}`);
        shell.exec(`python3 -m http.server ${port} --bind ${ip}`);
      }
    });
  });
program.parse(process.argv);
