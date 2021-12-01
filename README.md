
<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/dykoffi/files/main/mailer.png" alt="CIQL MAILER Logo">
</p>

<h1 align="center" style="color:grey">CIQL MAILER</h1>
<p style="font-size:18.5px; border-bottom:1px solid grey; padding-bottom:30px" align="justify">
    CIQl Mailer is a tool which permits you to send mailer with many templates you can use for it.
</p>
<h1 style="color:#9fa8da;">Intallation</h1>

> yarn add ciql-mailer
> 
> npm install ciql-mailer

<p align="center">
  <img src="https://raw.githubusercontent.com/dykoffi/files/main/alldemo.png" alt="ciql mailer all demo picture">
</p>

<h1 style="color:#9fa8da;">Usage</h1>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()
```

<h3 id="funcconnect" style="color:#ff80ab;">
<a href="#funcconnect"># agent.connect()</a></h3>

<p style="font-size:16.5px">
connect method permits you to initialize connection with mail.ciql.org credentials. If you want to use your own smtp configuration, use options parameter like this : 
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect({
  host: "xyz.test.com",
  port: 465,
  secure: true,
  auth: {
      user: "test@xyz.com",
      pass: "**********",
  },
})
```

<h3 id="funcsetoptions" style="color:#ff80ab;">
<a href="#funcsetoptions"># agent.setOptions(options)</a></h3>

<p style="font-size:16.5px">
Set options about the mail you want to send.
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()

agent.setoptions({ 
  subject: "Information about you", 
  from: "me@ciql.org", 
  to: "you@xyz.com",
  priority: "high", 
})

```

<p style="font-size:16.5px; color : red; font-weight:bold">
NB : connect() and setOptions() methods are required before sending email.
</p>

<h3 id="funcsendBlank" style="color:#ff80ab;">
<a href="#funcsendBlank"># agent.sendBlank(body)</a></h3>

<p style="font-size:16.5px">
Use this template to send email for blank.
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()

agent.setoptions({ 
  subject: "Information about you", 
  from: "me@ciql.org", 
  to: "you@xyz.com",
  priority: "high", 
})

agent.sendBlank("HI <b>You</b>, I'm very happy to see you today.")
.then(() => {
  //Do something
})
.catch((err) => {
  //Do something
})
```

<h3 id="funcsendCode" style="color:#ff80ab;">
<a href="#funcsendCode"># agent.sendCode(title:string, imgUrl:string)</a></h3>
<p align="center">
  <img width="" src="https://raw.githubusercontent.com/dykoffi/files/main/sendCode.png" alt="sendPub ciql mailer Demo">
</p>

<p style="font-size:16.5px">
Use this template to send email with code verification template. This function return the code which have been given.
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()

agent.setoptions({ 
  subject: "Information about you", 
  from: "me@ciql.org", 
  to: "you@xyz.com",
  priority: "high", 
})

agent.sendCode("Verification code", "Use this code to validate your account", 2536)
.then((code) => {
  //Do something
})
.catch((err) => {
  //Do something
})

```

<h3 id="funcsendApproval" style="color:#ff80ab;">
<a href="#funcsendApproval"># agent.sendApproval(title:string, description:string, noLink:string, yesLink:string)</a></h3>
<p align="center">
  <img width="" src="https://github.com/dykoffi/files/raw/main/demoSendApproval.png" alt="sendPub ciql mailer Demo">
</p>

<p style="font-size:16.5px">
Use this template to send approval email.
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()

agent.setoptions({ 
  subject: "Information about you", 
  from: "me@ciql.org", 
  to: "you@xyz.com",
  priority: "high", 
})

agent.sendApproval(
  "Production Approval", 
  "Do you accept condition to deploy now ?", 
  "https://api.approvals.com/no",  
  "https://api.approvals.com/yes"
  )
.then(() => {
  //Do something
})
.catch((err) => {
  //Do something
})
```

<h3 id="funcsendPub" style="color:#ff80ab;">
<a href="#funcsendPub"># agent.sendPub(imgUrl:string, title:string, description:string, openkLink:string)</a></h3>

<p align="center">
  <img width="" src="https://github.com/dykoffi/files/raw/main/sendAds.png" alt="sendPub ciql mailer Demo">
</p>
<p style="font-size:16.5px">
Use this template to send Pub email with redirect link.
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()

agent.setoptions({ 
  subject: "Information about you", 
  from: "me@ciql.org", 
  to: "you@xyz.com",
  priority: "high", 
})

agent.sendAds(
  "https://images.com/eiug254ef", 
  "New product", 
  "For developers and managers, it is very important", 
  "https://products.com/seemore")
.then(() => {
  //Do something
})
.catch((err) => {
  //Do something
})

```

<h3 id="sendArticle" style="color:#ff80ab;">
<a href="#sendArticle"># agent.sendArticle(title:string, description:string, imgUrl:string,  paragraphs:Array)</a></h3>

<p align="center">
  <img width="" src="https://raw.githubusercontent.com/dykoffi/files/main/sendArticle.png" alt="sendPub ciql mailer Demo">
</p>
<p style="font-size:16.5px">
Use this template to send Article email with one or many paragraphs.
</p>

```js
const Mailer = require('ciql-mailer')
const agent = new Mailer()

agent.connect()

agent.setoptions({ 
  subject: "Information about you", 
  from: "me@ciql.org", 
  to: "you@xyz.com",
  priority: "high", 
})

agent.sendArticle(
  "New product", 
  "For developers and managers, it is very important", 
  "https://images.com/eiug254ef", 
  [
      {
      title : "",
      img : "",
      text:""
    },
    {
      title : "",
      text:""
    }
  ]
  )
.then(() => {
  //Do something
})
.catch((err) => {
  //Do something
})

```
<p style="font-size:16.5px">Paragraphs parameter contains one or many paragraphs in Array. Each paragraph is an object with image, title and text attributes.</p>

<h1 style="color:#9fa8da;">Licence</h1>
<p>
MIT License

Copyright (c) 2021 dykoffi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</p>
<p align="center" style="font-size:12.5px">
LICENSE <code>MIT</code>
</p>