'use strict';
var path = require('path');
var fs = require('fs');


module.exports = {
  rewrite: rewrite,
  rewriteFile: rewriteFile,
  appName: appName,
  deleteFolder: deleteFolderRecursive,
  injectIntoFileFlag: injectIntoFileFlag,
  injectIntoFileEnd: injectIntoFileEnd,
  checkRouterFileFlag: checkRouterFileFlag,
  checkContentConflict: checkContentConflict,
  getServiceFunctions: getServiceFunctions,
  getAllServiceFunctions: getAllServiceFunctions,
  injectIntoServiceFileFlag: injectIntoServiceFileFlag,
  parseRouter: parseRouter
};

function rewriteFile(args) {
  args.path = args.path || process.cwd();
  var fullPath = path.join(args.path, args.file);

  args.spliceWithinLine = args.spliceWithinLine || false;

  args.haystack = fs.readFileSync(fullPath, 'utf8');
  var body = rewrite(args);

  fs.writeFileSync(fullPath, body);
}


function checkRouterFileFlag(fullPath) {
  var haystack = fs.readFileSync(fullPath, 'utf8');
  var lines = haystack.split('\n');

  var lastIndex = 1;
  var lastLine = lines[lines.length - lastIndex];
  while (!/};\s*/.test(lastLine) && lines.length > lastIndex) {
    lastIndex++;
    lastLine = lines[lines.length - lastIndex];
  }

  if (lastLine !== '};/*end*/') {
    var indexToSpliceAt = lastLine.indexOf('};');
    lines[lines.length - lastIndex] = lastLine.substr(0, indexToSpliceAt + 2) + '/*end*/';
    while (lastIndex > 0) {
      lastIndex--;
      lines[lines.length - lastIndex] = '';
    }
    var body = lines.join('\n');
    fs.writeFileSync(fullPath, body);
  }

}

function checkContentConflict(fullPath, content) {
  var haystack = fs.readFileSync(fullPath, 'utf8');
  var lines = haystack.split('\n');
  var checkContentConflict = false;
  lines.forEach(function(line, i) {
    if (line.indexOf(content) !== -1) {
      checkContentConflict = true;
    }
  });
  return checkContentConflict;
}

function injectIntoFileFlag(opts) {
  // appPath,filePath, injectContent
  // Set up config object
  var config = {
    file: path.join(
      opts.appPath,
      opts.filePath),
    needle: opts.needle || "};/*end*/",
    splicable: [opts.injectContent],
    spliceWithinLine: true
  };
  rewriteFile(config);
}

function injectIntoFileEnd(opts) {
  var fullPath = path.join(opts.appPath, opts.filePath);
  var haystack = fs.readFileSync(fullPath, 'utf8');
  var lines = haystack.split('\n');

  var lastIndex = 1;
  var lastLine = lines[lines.length - lastIndex];
  while (!/};\s*/.test(lastLine) && lines.length > lastIndex) {
    lastIndex++;
    lastLine = lines[lines.length - lastIndex];
  }

  var indexToSpliceAt = lastLine.indexOf('};');
  lines[lines.length - lastIndex] = lastLine.substr(0, indexToSpliceAt + 2) + '\n' + opts.injectContent;
  while (lastIndex > 0) {
    lastIndex--;
    lines[lines.length - lastIndex] = '';
  }
  var body = lines.join('\n');
  fs.writeFileSync(fullPath, body);
}


function injectIntoServiceFileFlag(opts) {

  var fullPath = path.join(opts.appPath, opts.filePath);
  var haystack = fs.readFileSync(fullPath, 'utf8');
  var lines = haystack.split('\n');

  var lastIndex = 1;
  var lastLine = lines[lines.length - lastIndex];
  var r = new RegExp(opts.needle);

  //找标志位
  while (!r.test(lastLine) && lines.length > lastIndex) {
    lastIndex++;
    lastLine = lines[lines.length - lastIndex];
  }

  //找标志位前一个}
  while (!/}\s*/.test(lastLine) && lines.length > lastIndex) {
    lastIndex++;
    lastLine = lines[lines.length - lastIndex];
  }


  var indexToSpliceAt = lastLine.indexOf('}');
  lines[lines.length - lastIndex] = lastLine.substr(0, indexToSpliceAt) + '\n' + opts.injectContent + lastLine.substr(indexToSpliceAt);

  var body = lines.join('\n');
  fs.writeFileSync(fullPath, body);
}

function getServiceFunctions(proxyServiceName, serviceFuncName) {
  var fullPath = path.join('app/proxy/', proxyServiceName + '.js');
  var haystack = fs.readFileSync(fullPath, 'utf8');
  var lines = haystack.split('\n');
  var r = new RegExp("\\*\\s*" + serviceFuncName + "(\\$[a-z0-9]+)?\\([a-zA-Z, ]*\\)");
  var matchFunctions = [];
  for (let i = 0; i < lines.length; i++) {
    var matchFunction = lines[i].match(r) || [];
    var isMatch = !!matchFunction && matchFunction.length > 0;
    if (isMatch) {
      matchFunctions.push(matchFunction[0].replace(/\*\s/, ''));
    }
  }
  return matchFunctions;
}

function getAllServiceFunctions(proxyServiceName) {
  var fullPath = path.join('app/proxy/', proxyServiceName + '.js');
  var haystack = fs.readFileSync(fullPath, 'utf8');
  var lines = haystack.split('\n');
  var r = new RegExp("\\*\\s*[a-z][a-zA-Z0-9]+(\\$[a-z0-9]+)?\\([a-zA-Z, ]*\\)");
  var matchFunctions = [];
  for (let i = 0; i < lines.length; i++) {
    var matchFunction = lines[i].match(r) || [];
    var isMatch = !!matchFunction && matchFunction.length > 0;
    if (isMatch) {
      matchFunctions.push(matchFunction[0].replace(/\*\s/, ''));
    }
  }
  console.log('匹配到的函数列表', matchFunctions);
  return matchFunctions;
}

function parseRouter(url) {
  const routerFiles = fs.existsSync('app/router') ? ['app/router.js'].concat(getFiles('app/router')) : ['app/router.js'];
  const pattern = /app\.([\w]+)\(.*((api|page).*)\)/;
  let router = {};

  routerFiles.every(file => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const lines = fileContent.split('\n');
    lines.every((line, index) => {
      if (line.indexOf(url) !== -1) {
        const match = line.match(pattern);

        // request method
        if (match && match[1]) {
          router.method = match[1];
        }
        // controller
        if (match && match[2]) {
          router.controller = match[2];
        }
        // comment
        if (index > 1 && lines[index - 1] && lines[index - 1].match(/^\s*\/\//)) {
          router.comment = lines[index - 1].replace(/\s*\/\/\s*/g, '');
        }

        // find out router, break out
        return false;
      } else {
        return true;
      }
    });

    // find out router, break out
    if (router.method && router.controller) {
      return false;
    } else {
      return true;
    }
  });

  console.log('匹配到的路由', router);
  return router;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function rewrite(args) {
  // check if splicable is already in the body text
  var re = new RegExp(args.splicable.map(function(line) {
    return '\s*' + escapeRegExp(line);
  }).join('\n'));

  if (re.test(args.haystack)) {
    return args.haystack;
  }

  var lines = args.haystack.split('\n');

  var otherwiseLineIndex = 0;
  lines.forEach(function(line, i) {
    if (line.indexOf(args.needle) !== -1) {
      otherwiseLineIndex = i;
    }
  });

  if ((otherwiseLineIndex > 0) && (args.spliceWithinLine)) {
    var line = lines[otherwiseLineIndex];
    var indexToSpliceAt = line.indexOf(args.needle);

    lines[otherwiseLineIndex] = line.substr(0, indexToSpliceAt) + args.splicable[0] + line.substr(indexToSpliceAt);

    return lines.join('\n');
  }

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  lines.splice(otherwiseLineIndex, 0, args.splicable.map(function(line) {
    return spaceStr + line;
  }).join('\n'));

  return lines.join('\n');
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(function(file, index) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  }
};

function appName(self) {
  var counter = 0,
    suffix = self.options['app-suffix'];
  // Have to check this because of generator bug #386
  process.argv.forEach(function(val) {
    if (val.indexOf('--app-suffix') > -1) {
      counter++;
    }
  });
  if (counter === 0 || (typeof suffix === 'boolean' && suffix)) {
    suffix = 'App';
  }
  return suffix ? self._.classify(suffix) : '';
}

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}
