import rp from 'request-promise';
import {
  trelloKey,
  trelloToken
} from './config';

const TRELLO_BASE_URL = 'https://api.trello.com/1';

function getTrelloRoute(slugs) {
  return `${TRELLO_BASE_URL}/${slugs.join('/')}?key=${trelloKey}&token=${trelloToken}`;
}

export function getLists(idBoard) {
  return rp.get({
    url: getTrelloRoute(['boards', idBoard, 'lists']),
    json: true
  });
}

export function getCardsOfList(idList) {
  return rp.get({
    url: getTrelloRoute(['lists', idList, 'cards']),
    json: true
  });
}

export function createCard(idList, name, desc) {
  return rp.post({
    url: `${getTrelloRoute(['cards'])}&idList=${idList}`,
    body: {
      name, desc
    },
    json: true
  })
}

export function updateCard(idCard, name, desc) {
  return rp.put({
    url: getTrelloRoute(['cards', idCard]),
    body: {
      name, desc
    },
    json: true
  })
}