import _ from 'lodash';
import { novelsListId, targetBoardId } from './config';
import { getLists, getCardsOfList, createCard, updateCard } from './trello';
import removeMd from 'remove-markdown';
import getChapter from './getChapter';

let LISTS;

const getNovels = async () => {
  const novelCards = await getCardsOfList(novelsListId);

  return novelCards.map(({ id, desc, name }) => {
    let sourceData;

    try {
      sourceData = JSON.parse(removeMd(desc)); 
    } catch (e) {
      throw new Error('Failed to parse source data from card.');
    }

    return {
      id,
      name,
      sourceData
    };
  })
}

const createChapterCard = (novel, chapter, content, idList) => {
  return createCard(idList, `${novel} - ${chapter}`, content);
}

const updateNovelCard = (idCard, name, sourceData, newLastChapter) => {
  let newSourceData = sourceData;
  newSourceData.lastChapter = newLastChapter;
  return updateCard(idCard, name, '```\n' + JSON.stringify(newSourceData, null, 2) + '\n```\n');
}

const getAndStoreChapter = async (id, novelName, sourceData, chapter, idList) => {
  const { site, key, chapterPrefix, lastChapter } = sourceData;

  let retVal = true;

  const content = await getChapter(site, key, chapterPrefix, chapter)
    .catch(err => {
      return false;
    });

  if (content && content.length > 3000) {
    console.log(`Saving ${novelName} - ${chapter}`);
    const cardCreated = await createChapterCard(novelName, chapter, content, idList)
    .catch(err => {
      console.log('Failed to create chapter.', { novelName, chapter, content, error: err.message });
      return false;
    });

    if (cardCreated) {
      return true;
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export const fetchNovels = async (event, context, callback) => {
  LISTS = await getLists(targetBoardId)
  const novels = await getNovels();

  novels.forEach((novel, index ) => {
    novels[index].idList = _.find(LISTS, (list) => {
      return list.name === novel.name;
    }).id;
  })

  novels.forEach(async ({ id, name, sourceData, idList }) => {
    const { site, key, chapterPrefix, lastChapter } = sourceData;
    let done = false;
    let chapter = lastChapter + 1;

    while (!done) {
      if (await getAndStoreChapter(id, name, sourceData, chapter, idList).catch(err => {
        done = true;
      })) {
        chapter++;
      } else {
        done = true;
      }
    }
    const updatedNovelCard = await updateNovelCard(id, name, sourceData, chapter - 1);
  });
};
