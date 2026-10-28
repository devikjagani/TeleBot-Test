const http = require('http');
const path = require('path');
const fs = require('fs');
const root = path.join(__dirname, 'public');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 7313);
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const headers = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
  if (req.method === 'POST' && url.pathname === '/api/send-test') {
    let raw='';
    try {
      for await (const chunk of req) { raw += chunk; if (raw.length > 20000) throw new Error('Request is too large.'); }
      const body = JSON.parse(raw || '{}');
      const token = String(body.token || '').trim();
      const chatId = String(body.chatId || '').trim();
      const message = String(body.message || '').trim();
      if (!/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) return respond(400,{ok:false,error:'Enter a valid-looking Telegram bot token.'});
      if (!chatId) return respond(400,{ok:false,error:'Enter your Telegram chat ID.'});
      if (!message) return respond(400,{ok:false,error:'Enter a test message.'});
      if (message.length > 4096) return respond(400,{ok:false,error:'Telegram messages can contain at most 4096 characters.'});
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chatId,text:message,disable_web_page_preview:true}),signal:AbortSignal.timeout(15000)});
      const data = await response.json().catch(()=>({ok:false,description:'Telegram returned an unreadable response.'}));
      if (!response.ok || !data.ok) return respond(400,{ok:false,error:data.description || `Telegram API returned HTTP ${response.status}`,error_code:data.error_code || response.status,parameters:data.parameters || undefined});
      return respond(200,{ok:true,result:{message_id:data.result.message_id,chat_id:data.result.chat.id,chat_type:data.result.chat.type,date:data.result.date,text:data.result.text},description:'Telegram accepted the message successfully.'});
    } catch(e) { return respond(400,{ok:false,error:e.name==='TimeoutError'?'Telegram API request timed out. Please try again.':e.message==='Unexpected end of JSON input'?'Invalid request body.':e.message || 'Could not reach Telegram.'}); }
  }
  function respond(status,data){res.writeHead(status,{...headers,'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));}
  if (req.method !== 'GET') return respond(404,{error:'Not found'});
  const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const file = path.resolve(root, rel);
  if (!file.startsWith(root + path.sep) && file !== path.join(root,'index.html')) return respond(403,{error:'Forbidden'});
  fs.readFile(file,(err,data)=>{if(err)return respond(404,{error:'Not found'});const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};res.writeHead(200,{...headers,'Content-Type':types[ext]||'application/octet-stream'});res.end(data);});
});
server.listen(port,host,()=>console.log(`Telegram Notification Tester running at http://${host}:${port}`));
