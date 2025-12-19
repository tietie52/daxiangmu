# 新增消息功能排查指南

## 问题描述
前端新增消息时弹出"操作失败，请检查表单内容"错误

## 已修复的问题

1. **请求头格式错误**：在 `src/app.tsx` 文件中，全局请求拦截器将 `headers` 初始化为空数组 `[]`，已修改为对象 `{}`

2. **硬编码token覆盖**：在 `src/requestErrorConfig.ts` 文件中，请求拦截器被配置为将 `?token=123` 硬编码到所有请求的URL中，已移除

3. **错误信息优化**：在 `src/pages/Display/MessageList.tsx` 文件中，添加了更详细的错误日志和错误类型判断

## 进一步排查步骤

### 1. 检查浏览器开发者工具

请打开浏览器的开发者工具（F12），切换到"Network"标签页，然后尝试提交表单。查看API请求的详细信息：

- **请求URL**：确认请求是否发送到了正确的URL（应该是 `http://localhost:8001/api/crypto-news`）
- **请求头**：确认是否包含 `Authorization` 头部，并且值为 `Bearer <token>`
- **请求体**：确认提交的数据格式是否正确
- **响应**：查看服务器返回的响应内容和状态码

### 2. 检查后端服务

- 确认后端服务是否正在运行（默认端口为 8080）
- 检查后端日志，看看是否有任何错误信息
- 确认 `/crypto-news` 接口是否正确处理POST请求

### 3. 检查代理配置

确认 `config/proxy.ts` 文件中的代理配置是否正确：

```typescript
dev: {
  '/api/**': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
}
```

这个配置应该将 `http://localhost:8001/api/crypto-news` 代理到 `http://localhost:8080/crypto-news`

### 4. 检查表单数据格式

确保提交的数据格式与后端期望的格式一致：

```typescript
const submitData = {
  title: values.title,
  content: values.content,
  cryptoType: values.cryptoType,
  emotion: values.sentiment === 'positive' ? '正面' : 
           values.sentiment === 'negative' ? '负面' : '中性',
  publishTime: values.date.format('YYYY-MM-DD HH:mm:ss'),
  source: values.source
};
```

### 5. 检查认证token

- 确认localStorage中是否存储了 `access_token`
- 确认token是否有效且未过期

## 常见错误及解决方案

### 401 Unauthorized
- 原因：认证token无效或未提供
- 解决方案：检查token是否正确存储和传递，重新登录获取新token

### 403 Forbidden
- 原因：用户权限不足，无法执行该操作
- 解决方案：联系管理员获取相应权限

### 400 Bad Request
- 原因：请求参数错误
- 解决方案：检查表单数据格式是否与后端期望的格式一致

### 500 Internal Server Error
- 原因：后端服务内部错误
- 解决方案：检查后端日志，修复后端服务错误

## 联系方式

如果以上步骤都无法解决问题，请联系后端开发人员，提供浏览器开发者工具中的请求和响应详细信息。