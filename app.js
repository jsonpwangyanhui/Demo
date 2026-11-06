const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const REDFOX_API_KEY = 'ak_57d02d270b3d42xxxxxxxxxxx';
const REDFOX_API_URL = "https://redfox.hk/story/api/dyData/searchUser";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// 浏览器调用本地接口：POST /api/douyin/search
// API Key 只保存在服务端环境变量中，不会暴露给浏览器。
app.post("/api/douyin/search", async (req, res) => {
  const { keyword, offset = 0, sortType = "_0" } = req.body || {};

  if (!REDFOX_API_KEY) {
    return res.status(500).json({
      code: "CONFIG_ERROR",
      msg: "服务端未配置 REDFOX_API_KEY，请先设置环境变量",
      data: null
    });
  }

  if (typeof keyword !== "string" || !keyword.trim()) {
    return res.status(400).json({
      code: "PARAM_ERROR",
      msg: "keyword 不能为空",
      data: null
    });
  }

  const safeOffset = Number(offset);
  if (!Number.isInteger(safeOffset) || safeOffset < 0) {
    return res.status(400).json({
      code: "PARAM_ERROR",
      msg: "offset 必须是大于或等于 0 的整数",
      data: null
    });
  }

  try {
    const upstream = await axios.post(
      REDFOX_API_URL,
      {
        keyword: keyword.trim(),
        offset: safeOffset,
        sortType: String(sortType)
      },
      {
        headers: {
          "Content-Type": "application/json",
          REDFOX_API_KEY
        },
        timeout: 30000
      }
    );

    // 将上游真实响应原样转发给前端，便于页面按真实字段渲染。
    return res.status(200).json(upstream.data);
  } catch (error) {
    const upstreamStatus = error.response?.status || 502;
    const upstreamData = error.response?.data;

    console.error("RedFox Hub API 调用失败：", {
      status: upstreamStatus,
      message: error.message,
      data: upstreamData
    });

    return res.status(502).json({
      code: "UPSTREAM_ERROR",
      msg: "RedFox Hub 接口调用失败，请检查 API Key、请求参数或服务状态",
      data: upstreamData || null
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "redfox-hub-demo" });
});

app.listen(PORT, () => {
  console.log(`RedFox Hub 演示服务已启动：http://localhost:${PORT}`);
});
