
<h1 align="center" style="color:grey">ciql-deploy</h1>
<p style="font-size:18.5px; border-bottom:1px solid grey; padding-bottom:30px" align="justify">
   Ciql deploy allows you to automate your deployments on remote servers by securely storing their information and scheduling jobs on each server.
</p>
<h1 style="color:#9fa8da;">Intallation</h1>

```bash
yarn add ciql-deploy
```

```bash
 npm install ciql-deploy
```


<h1 style="color:#9fa8da;">Usage</h1>

```bash
cdep --help

Usage: cdep [options] [command]

Options:
  -h, --help      display help for command

Commands:
  init            Initialize config files
  job             Manage jobs configuration
  server          Manage Servers configuration
  help [command]  display help for command
```

<h3 id="server" style="color:#ff80ab;">
<a href="#server"># cdep server</a></h3>

### cdep server allows you to manage servers. The configurations are saved in secure files in order to preserve confidential information against possible attackers. 

### For even more security, you can ignore the .cdep folder in your .gitigonre to avoid committing it to your public repository.

```bash
Usage: cdep server [options] [command]

Manage Servers

Options:
  -h, --help                          display help for command

Commands:
  add <server_name>                   Add new server configuration
  ls                                  show all connected servers information
  edit <server_name>                  Edit server configuration
  rm <server_name>                    Delete specify server
  copy <server1_name> <server2_name>  Copy server config to another server
  clear                               Clear all servers data
  help [command]                      display help for command
```


<h3 id="job" style="color:#ff80ab;">
<a href="#job"># cdep job</a></h3>

### cedp job allows you to schedule jobs to be run on pre-registered servers. It offers you several commands for managing and executing jobs.

```bash
Usage: cdep job [options] [command]

Manage job configuration

Options:
  -h, --help                    display help for command

Commands:
  add <job_name>                add job
  edit <job_name>               Edit specify job
  ls                            show all jobs information
  rm <job_name>                 Delete specify job
  clear                         Clean all servers data
  run <job>                     Execute a job
  copy <job1_name> <job2_name>  Copy job config to another job
  help [command]                display help for command
```

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