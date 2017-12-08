# Light Novels to Trello

![](https://media.giphy.com/media/l3mZ71Pw3D6xQ0brG/giphy.gif)

A serverless function running on AWS Lambda that periodically fetches light novels from wuxiaworld and moonbunnycafe and puts them into a Trello board.

I've been having trouble reading novels from the site on the MTA (no service) so I needed an offline solution. I load my Trello board up in the morning before I head out and we're good to go for my morning commute to work.

# Setup

You'll need to:

- Create a Trello account (for the bot - use your personal account at your own risk since we'll be deploying to AWS with a token).
- Get your Trello API Key and Token from https://trello.com/app-key
- Create a board for your novels and get it's board id (https://trello.com/1/boards/<boardShortId>).
- Create a list on your board where you'll be defining which novels you want. Get the list id too. (https://trello.com/1/boards/<boardShortId>/lists)
- Rename `config.sample.js` to `config.js` and fill in the blanks.
- `npm install` and then `sls deploy`

# Defining your novels

![](https://gyazo.com/835db3b6cd942d05f0fa6f5e035383bc)

On your novel list and a card and list with your novel name (it has to be matching!).

In your card you'll want to put this JSON blob in the description:

```
{
  "site": "wuxiaworld",
  "key": "overgeared-index",
  "chapterPrefix": "og-chapter",
  "lastChapter": 164
}
```

or 


```
{
  "site": "moonbunnycafe",
  "key": "the-demonic-king-chases-his-wife-the-rebellious-good-for-nothing-miss",
  "chapterPrefix": "dkc-chapter",
  "lastChapter": 1308
}
```

And then you wait... the function should check if there are new chapters every hour.
