/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra');
const chalk = require('chalk');
const ask = require('./ask');
const { log } = require('@blueking/cli-utils');
const ora = require('ora');

module.exports = async function (projectName, targetDir) {
  const result = validateProjectName(projectName);
  if (!result.validForNewPackages) {
    log.error(`Invalid project name: "${projectName}"`);
    result.errors && result.errors.forEach((err) => {
      log.error(`Error: ${err}`);
    });
    result.warnings && result.warnings.forEach((warn) => {
      log.error(`Warning: ${warn}`);
    });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    const { isOverWrite } = await ask([
      {
        name: 'isOverWrite',
        type: 'confirm',
        message: `Target directory ${chalk.cyan(targetDir)} already exists. Continue will overwrite the folder`,
      },
    ]);

    if (isOverWrite) {
      const spinner = ora(`Removing target directory (${targetDir})`).start();
      await fs.remove(targetDir);
      spinner.stop();
    } else {
      process.exit(1);
    }
  }
};
