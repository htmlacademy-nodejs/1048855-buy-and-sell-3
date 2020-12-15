"use strict";

const {getRandomInt, shuffle} = require(`../../utils`);
const fs = require(`fs`).promises;
const path = require(`path`);
const logger = require(`../../logger`);

const DEFAULT_COUNT = 1;
const MAX_OFFERS_COUNT = 1000;
const FILE_NAME = `mocks.json`;
const fileSentencesPath = path.resolve(`data/sentences.txt`);
const fileTitlesPath = path.resolve(`data/titles.txt`);
const fileCategoriesPath = path.resolve(`data/categories.txt`);

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, `utf8`);
    return data.split(`\n`);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const getPictureFileName = (number) => {
  return `item${number < 10 ? `0${number}` : number}.jpg`;
};

const getCategories = (categories, count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const index = getRandomInt(0, categories.length - 1);
    result.push(...categories.splice(index, 1));
  }

  return result;
};

const generateOffers = (count, sentences, titles, categories) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: getCategories(categories, getRandomInt(1, categories.length)),
      description: shuffle(sentences).slice(1, 5).join(` `),
      picture: getPictureFileName(
          getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
      ),
      title: titles[getRandomInt(0, titles.length - 1)],
      type:
        OfferType[
          Object.keys(OfferType)[
            Math.floor(Math.random() * Object.keys(OfferType).length)
          ]
        ],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    try {
      const sentences = await readFile(fileSentencesPath);
      const titles = await readFile(fileTitlesPath);
      const categories = await readFile(fileCategoriesPath);
      const [count] = args;
      const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
      if (countOffer > MAX_OFFERS_COUNT) {
        logger.error(`Не больше ${MAX_OFFERS_COUNT} публикаций`);
        process.exit(1);
      }
      const content = JSON.stringify(
          generateOffers(countOffer, sentences, titles, categories)
      );
      try {
        await fs.writeFile(FILE_NAME, content);
        logger.success(`Operation success. File created.`);
      } catch (error) {
        logger.error(`Can't write data to file...`, error);
      }
    } catch (error) {
      logger.error(`Can't generate data...`, error);
      process.exit(1);
    }
  },
};
