#!/usr/bin/env node
const pkg = require('./package');
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const handlebars = require('handlebars');

program
  .version(pkg.version, '-v, --version')    
  .command('init <name>')
  .action((name) => {
    inquirer.prompt([
      {
          type: 'input',
          name: 'author',
          message: '请输入作者名'
      }
    ]).then((answers) => {
      const lqProcess = ora('正在创建rollup模版...')
      lqProcess.start()
      download('https://github.com/huangtiti/rollup-demo.git',
        name, { clone: true }, (err) => {
        if (err) {
          lqProcess.fail('报错啦！！',chalk.red(err));
        } else {
          const fileName = `${name}/package.json`
          const meta = {
            projectName:name,
            author: answers.author||'一位不愿透露姓名的大佬'
          }
          if (fs.existsSync(fileName)) {
            const content = fs.readFileSync(fileName).toString()
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result)
          }
          lqProcess.succeed(chalk.green('成功创建rollup模版！！'));
        }
      })
    })
})

  
program.parse(process.argv)
