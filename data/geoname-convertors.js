import events from "node:events";
import fs from "node:fs";
import readline from "node:readline";

export async function convertGeonameData(
  inputFilePath,
  outputFilePath,
  lastLineIndex
) {
  let counter = 0;
  try {
    const readStream = fs.createReadStream(inputFilePath);

    const writeStream = fs.createWriteStream(outputFilePath);
    writeStream.write(`{`);

    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    let isLast = false;

    readStream.on("end", function () {
      isLast = true;
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
