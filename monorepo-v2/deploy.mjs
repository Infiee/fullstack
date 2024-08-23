/**
 * ssh2-sftp-client只有上传功能，需要ssh2额外执行shell脚本
 */
import path from "node:path";
import Client from "ssh2-sftp-client";
import "dotenv/config";
import { Client as SSHClient } from "ssh2";
import compressing from "compressing";
import fs from "node:fs";

const {
  SERVER_HOST,
  SERVER_PASSWORD,
  SERVER_FTP_PORT,
  SERVER_FTP_USER,
  SERVER_FTP_SITE_DIR,
} = process.env;

const connectOption = {
  host: SERVER_HOST,
  port: SERVER_FTP_PORT,
  username: SERVER_FTP_USER,
  password: SERVER_PASSWORD,
};

const sourceDir = path.resolve("./nest-app");
const destDir = "./nest-app.tar.gz";

async function zipFolder() {
  return compressing.tgz.compressDir(sourceDir, destDir);
}

function clearUploadFile() {
  fs.rmSync(sourceDir, { recursive: true, force: true });
  fs.rmSync(destDir, { recursive: true, force: true });
}

async function upload() {
  let sftp = new Client();
  try {
    await sftp.connect(connectOption);
    sftp.on("upload", (info) => {
      console.log(`上传Listener: ${info.source}`);
    });
    const res = await sftp.fastPut(destDir, SERVER_FTP_SITE_DIR + '/nest-app.tar.gz');
    await sftp.end();
    console.log("上传结果", res);
    clearUploadFile();
  } catch (error) {
    console.log("上传错误", error);
    await sftp.end();
  }
}

function deploy() {
  const ssh = new SSHClient();
  ssh
    .on("ready", () => {
      console.log("Client :: ready");
      ssh.exec("/home/test.sh", (err, stream) => {
        if (err) throw err;
        stream
          .on("close", () => {
            console.log("Script execution completed");
            ssh.end();
          })
          .on("data", (data) => {
            console.log("输出: " + data);
          })
          .on("error", (err) => {
            console.log("Error: " + err);
          });
      });
      // return ssh.end();
    })
    .connect(connectOption);
}

async function bootstrap() {
  await zipFolder();
  await upload();
  // clearUploadFile();
  deploy();
}

bootstrap();
