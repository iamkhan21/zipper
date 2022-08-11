import events from "node:events";
import fs from "node:fs";
import readline from "node:readline";

export async function convertGeonameDataToJSON(
  inputFilePath,
  outputFilePath,
  lastLineIndex
) {
  let counter = 0;
  try {
    const writeStream = fs.createWriteStream(outputFilePath);
    writeStream.write(`{`);

    const rl = readline.createInterface({
      input: fs.createReadStream(inputFilePath),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      counter++;

      const data = line.split(/\t+/);

      writeStream.write(
        `"${data[1].replace(" ", "")}":${JSON.stringify({
          country: data[0],
          lat: +data[data.length - 3],
          lng: +data[data.length - 2],
        })}`
      );

      if (counter < lastLineIndex) {
        writeStream.write(`,`);
      }
    });

    await events.once(rl, "close");

    writeStream.end(`}`);
    console.log(`Reading file line by line with readline done.`);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(
      `The script uses approximately ${Math.round(used * 100) / 100} MB`
    );
  } catch (err) {
    console.error(err);
  }
}

export async function convertGeonameDataToCSV(inputFilePath, outputFilePath) {
  const keys = new Set();
  try {
    const writeStream = fs.createWriteStream(outputFilePath);
    writeStream.write(`country\tcode\tlat\tlng\n`);

    const rl = readline.createInterface({
      input: fs.createReadStream(inputFilePath),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const data = line.split(/\t+/);
      const country = data[0];
      const code = data[1].replace(" ", "");
      const lat = +data[data.length - 3];
      const lng = +data[data.length - 2];

      if (keys.has(code)) {
        console.log("duplication", code);
      } else {
        writeStream.write(`${country}\t${code}\t${lat}\t${lng}\n`);
        keys.add(code);
      }
    });

    await events.once(rl, "close");

    writeStream.end();

    console.log(`Reading file line by line with readline done.`);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(
      `The script uses approximately ${Math.round(used * 100) / 100} MB`
    );
  } catch (err) {
    console.error(err);
  }
}
