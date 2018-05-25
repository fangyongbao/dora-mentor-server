const fs = require('fs');
const path = require('path');
const os = require('os');
const nunjucks = require('nunjucks');

nunjucks.configure('*', {
  autoescape: false,
});

module.exports = () => {
  const getComponentList = () => {
    // 获取用户目录
    const userPath = os.homedir();
    let componentList = {};
    const file = `${userPath}/.mentor/component.json`;
    if (fs.existsSync(file)) {
      componentList = require(file);
    }
    for (const key in componentList) {
      if (componentList[key].path) {
        if (!fs.existsSync(componentList[key].path)) {
          delete componentList[key];
        }
      }
    }
    return componentList;
  };
  
  const getDocument = (componentList) => {
    const document = {};
    for (const key in componentList) {
      document[key] = `${componentList[key].path}/document`;
    }
    return document;
  };
  
  const getAlias = (componentList) => {
    const alias = {};
    for (const key in componentList) {
      const name = `@alipay/${key}`;
      alias[name] = `${componentList[key].path}/src`;
    }
    return alias;
  };
  
  const entryTemplate = fs.readFileSync(path.join(process.cwd(), 'site/bisheng-pc.nunjucks.js')).toString();
  const entryPath = `${path.join(process.cwd(), 'site/bisheng-pc2.config.js')}`;
  const entryWapTemplate = fs.readFileSync(path.join(process.cwd(), 'site/bisheng-wap.nunjucks.js')).toString();
  const entryWapPath = `${path.join(process.cwd(), 'site/bisheng-wap2.config.js')}`;
  
  const componentList = getComponentList();
  const document = getDocument(componentList);
  const alias = getAlias(componentList);

  // console.log(entryPath);
  // console.log(entryWapPath);
  
  // console.log(`document: ${JSON.stringify(document, null, 2)}`);
  // console.log(`componentList: ${JSON.stringify(componentList, null, 2)}`);
  // console.log(`alias: ${JSON.stringify(alias, null, 2)}`);
  
  fs.writeFileSync(
    entryPath,
    nunjucks.renderString(entryTemplate, {
      document: JSON.stringify(document),
      componentList: JSON.stringify(componentList),
      alias: JSON.stringify(alias),
    }),
  );
  
  fs.writeFileSync(
    entryWapPath,
    nunjucks.renderString(entryWapTemplate, {
      document: JSON.stringify(document),
      componentList: JSON.stringify(componentList),
      alias: JSON.stringify(alias),
    }),
  );
};
