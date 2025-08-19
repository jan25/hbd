function unlock(garbage, key) {
  const keyArr = new TextEncoder().encode(key);
  const cnt = keyArr.reduce((a, b) => a + b, 0);
  const bytes = aesjs.utils.hex.toBytes(garbage);
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyArr, new aesjs.Counter(cnt));
  const decryptedBytes = aesCtr.decrypt(bytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

function mkKey(key) {
  let small = "";
  while (small.length < 16) {
    small += key;
  }
  return small.slice(0, 16);
}

function isValidKey(key) {
  try {
    getImgData(key);
    return true;
  } catch (e) {
    return false;
  }
}

function getImgData(key) {
  const imgData = imgDataProcessed.data;
  let data = unlock(imgData, mkKey(key));
  data = JSON.parse(data);
  return {
    width: data.width,
    height: data.height,
    pixels: data.data,
  };
}
