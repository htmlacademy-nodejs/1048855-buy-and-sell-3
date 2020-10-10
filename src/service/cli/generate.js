"use strict";

const { getRandomInt, shuffle } = require(`../../utils`);
const fs = require(`fs`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [`Книги`, `Разное`, `Посуда`, `Игры`, `Животные`, `Журналы`];

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

const getPictureFileName = (number) => {
  return `item${number < 10 ? `0${number}` : number}.jpg`;
};

const getCategories = (count) => {
  const categories = CATEGORIES.slice();
  const result = [];
  for (let i = 0; i < count; i++) {
    const index = getRandomInt(0, categories.length - 1);
    result.push(...categories.splice(index, 1));
  }

  return result;
};

const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: getCategories(getRandomInt(1, CATEGORIES.length)),
      description: shuffle(SENTENCES).slice(1, 5).join(` `),
      picture: getPictureFileName(
        getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
      ),
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
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
  run(args) {
    try {
      const [count] = args;
      const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
      if (countOffer > 1000) {
        console.error(`Не больше 1000 объявлений`);
        process.exit(1);
      }
      const content = JSON.stringify(generateOffers(countOffer));
      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          return console.error(`Can't write data to file...`);
        }

        console.info(`Operation success. File created.`);
        process.exit(0);
      });
    } catch {
      console.error(`Can't generate data...`);
      process.exit(1);
    }
  },
};
