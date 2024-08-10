const BUCKET_SIZES = {
  day: 36e5, // 1 hour (24 buckets)
  week: 36e5 * 24, // 24 hours (7 buckets)
  month: 36e5 * 24, // 24 hours (+- 30 buckets)
};

const LABEL_FUNCS = {
  day: (key) => new Date(key).toLocaleTimeString(),
  week: (key) => new Date(key).toLocaleDateString("en-GB", { weekday: "short" }),
  month: (key) => new Date(key).toLocaleDateString(),
};

const MS_IN = {
  day: 36e5 * 24,
  week: 36e5 * 24 * 7,
  month: 36e5 * 24 * 31,
};

const GRANULARITY = {
  day: "HOURLY",
  week: "DAILY",
  month: "DAILY",
};

function histogram(data, showDays, keys, combineStrategy = "sum") {
  let output = [];
  let maxTime = new Date().getTime();
  let minTime = new Date() - MS_IN[showDays];
  let bucketWidth = BUCKET_SIZES[showDays];
  let bucketStart = roundDownTo(minTime, bucketWidth);
  let i = 0;
  while (bucketStart < maxTime) {
    let bucketData = Object.fromEntries(keys.map((k) => [k, 0]));
    bucketData.created = bucketStart;
    let itemsInBucket = 0;
    while (
      data[i] &&
      bucketStart <= data[i].created &&
      data[i].created < bucketStart + bucketWidth
    ) {
      for (var k of keys) bucketData[k] += data[i][k];
      i++;
      itemsInBucket++;
    }
    if (combineStrategy === "avg" && itemsInBucket > 1) {
      for (var k2 of keys) bucketData[k2] /= itemsInBucket;
    }
    output.push(bucketData);
    bucketStart += bucketWidth;
  }
  return output;
}

function roundDownTo(n, multiple) {
  return multiple * Math.floor(n / multiple);
}

export { histogram, BUCKET_SIZES, LABEL_FUNCS, MS_IN, GRANULARITY };
