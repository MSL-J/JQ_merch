# Just Q 상품가공 프로젝트

## What it's made of

- Puppeteer를 사용하여 크롤링 구현
- Backend 구성으로는 express 미들웨어 사용.

## How it works - locally (dev)

- Crawling 관련 코드:
  - Backend: _crawler.js_
  - Frontend: services/apiService.js의 _nameCrawlingApi()_
- 현재 localhost의 port 4000에서 서버가 구동되도록 되어있음. (언제든 변경 가능 - Front에서는 _utils/api.js의 **crawlingAPI**_, Backend에서는 _.env의 **CRAWLING-SERVER-PORT**_)
- Web server(_React_)는 local에서 구동시 port 3000이며, package.json의 scripts의 dev에 나타나있듯이 *concurrently*를 이용해 terminal에서 _npm run dev_ 실행시 web server와 backend server 동시 시작.
- Build와 Deploy는 gh-pages로 checkout 한 후 _npm run deploy_ 으로 local에서 build와 gh-pages branch로 push까지 실행됨
- Deploy 이후 github pages에서 구동시 _crawler.js_ 를 외부 서버에서 따로 구동시킨 후 front에서 _utils/api.js의 **crawlingAPI**_ 만 바꿔주면 될 것을 예상.

## Issues faced whilst developing

- Puppeteer를 launch함에 있어 arguments들을 지정해줘야 하는데 정확한 답이 없어 arguments들 중 실행되는 arguments의 조합을 (정확한 근거나 이해가 없이)선택함. (crawling.js line _20~28_)
- Server를 구동하는 OS와 directory에 따라 executablePath가 달라짐 (crawling.js line _32_)
- 유의사항: 크롤링 시 네이버 쇼핑 페이지의 html classname과 innerText를 이용하는데 이는 상시 바뀔 수 있음
