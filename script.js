// Run using:
// node script.js 10 my-key

const fs = require("fs");
const jpeg = require("jpeg-js");
const aesjs = require("aes-js");

const filePath = "wish/img.jpeg";
const imgOutputPath = "data.js";

const pixelSpacing = parseInt(process.argv[2], 10) || 1;
console.log(`Using pixelSpacing: ${pixelSpacing}`);
const key = process.argv[3] || "foo";
console.log(`Using key: ${key}`);

try {
  // Read the JPEG file into a buffer
  const jpegData = fs.readFileSync(filePath);

  // Decode the JPEG buffer into a raw image data object
  const rawImageData = jpeg.decode(jpegData);

  // Check if the decoding was successful
  if (!rawImageData || !rawImageData.data) {
    console.error("Error: Could not decode the JPEG image.");
    return;
  }

  const { width, height, data } = rawImageData;
  console.log(`Image Dimensions: ${width} x ${height}`);

  const pixels = [];

  // Iterate through each pixel to get RGB values
  for (let y = 0; y < height; y += pixelSpacing) {
    const row = [];
    for (let x = 0; x < width; x += pixelSpacing) {
      // Calculate the starting index of the pixel's data in the array
      // Each pixel has 4 values: Red, Green, Blue, Alpha (transparency)
      const index = (y * width + x) * 4;

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      row.push([red, green, blue]);
    }
    pixels.push(row);
  }

  console.log(
    `Final parsed dimensions: ${pixels.length} x ${pixels[0].length}`
  );

  const json = {
    width,
    height,
    data: pixels,
  };
  const jsonString = JSON.stringify(json);

  // Convert the JSON string to a byte array (required by aes-js)
  const textBytes = aesjs.utils.utf8.toBytes(jsonString);

  let small = "";
  while (small.length < 16) {
    small += key;
  }
  const keyArr = new TextEncoder().encode(small.slice(0, 16));
  const cnt = keyArr.reduce((a, b) => a + b, 0);
  var aesCtr = new aesjs.ModeOfOperation.ctr(keyArr, new aesjs.Counter(cnt));

  // Encrypt the byte array. `encrypt` pads the data to a multiple of 16 bytes.
  const encryptedBytes = aesCtr.encrypt(textBytes);
  const encryptedStr = aesjs.utils.hex.fromBytes(encryptedBytes);

  // Write the encrypted byte array to a file.
  // We'll write it as a raw buffer, so the output file won't be human-readable.
  fs.writeFileSync(
    imgOutputPath,
    `const imgDataProcessed = {data: "${encryptedStr}"};`
  );
  console.log("Done processing image");
} catch (err) {
  console.error(`An error occurred: ${err.message}`);
}
