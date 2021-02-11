// Small command line node app takes a URL and a local file path,
// &  downloadsthe resource to the specified path.
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getResource = (url, localPath) => {
  request(url, (error, response, body) => {
    if (error) {
      console.log(error);
      process.exit();
    }
    // Writing the file
    fs.writeFile(localPath, body, (error) => {
      fs.access(localPath, (error) => {
        if (error) console.log(error);
        process.exit();
      });
      if (error) {
        console.log(error);
      }
      console.log(`Downloaded and saved ${body.length} bytes to ${localPath}`);
      rl.close();
    });
  });
};

const pageFetcher = () => {
  const input = process.argv.slice(2);
  const [url, path] = [input[0], input[1]];
  if (fs.existsSync(path)) {
    rl.question(`${path} already exist, do you want to continue? (press y)`, (answer) => {
      if (answer.toLowerCase() === 'y') {
        getResource(url, path);
      } else process.exit();
    });
  } else getResource(url, path);
};

pageFetcher();