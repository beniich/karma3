const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules') || file.includes('.git') || file.includes('dist')) {
            if (!--pending) done(null, results);
            return;
          }
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (/\.(ts|tsx|json|md|yml|yaml|css|html|js|cjs)$/.test(file)) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('.', (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace strings
    content = content.replace(/Karma3\s+Karma3\s+Hub/ig, 'Karma3');
    content = content.replace(/Karma3\s+Karma3/ig, 'Karma3');
    content = content.replace(/Karma3\s+Hub/ig, 'Karma3');
    content = content.replace(/Karma3/g, 'Karma3');
    content = content.replace(/Karma3/g, 'Karma3');
    content = content.replace(/karma3/g, 'karma3');
    content = content.replace(/Karma3/g, 'Karma3');
    content = content.replace(/karma3/g, 'karma3');
    content = content.replace(/Karma3/g, 'Karma3');
    content = content.replace(/karma3/g, 'karma3');
    content = content.replace(/karma3/g, 'karma3');
    content = content.replace(/Karma3/g, 'Karma3');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated content of:', file);
    }
  });
  console.log("String replacements complete.");
});
