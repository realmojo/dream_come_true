const { Builder, Browser, By, Key, until } = require("selenium-webdriver");

const gs_cred = require("./sheet.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(
  "1HaNcq2TJrbjchZDumxiBuOMD7sG_u_7CFivNP2jDZBI"
);

const menus = 734;
// 568 까지 진행

const getCategory = async (driver) => {
  try {
    _category = await driver.findElement(By.className("breadcrumb")).getText();
    _category = _category
      .replace("\n", " / ")
      .replace("\n", " / ")
      .replace("\n", " / ")
      .replace("\n", " / ");
  } catch {
    _category = "-";
  }

  return _category;
};

const getTitles = async (driver) => {
  let _titles = [];
  try {
    let t = await driver.findElements(By.className("title"));
    for (const item of t) {
      let d = await item.getText();
      d = d.replace("ㆍ", "");
      _titles.push(d.trim());
    }
  } catch (e) {
    _titles = [];
  }
  return _titles;
};

const getContents = async (driver) => {
  let _contents = [];
  try {
    let t = await driver.findElements(By.className("content"));
    for (const item of t) {
      let d = await item.getText();
      _contents.push(d.trim());
    }
  } catch (e) {
    _contents = [];
  }
  return _contents;
};

const getInfos = async (driver) => {
  let _category = await getCategory(driver);
  let _titles = await getTitles(driver);
  let _contents = await getContents(driver);

  return {
    _category,
    _titles,
    _contents,
  };
};

const insertSheet = async (sheet, driver, _category, _titles, _contents) => {
  for (let i in _titles) {
    let t = {
      _category,
      _title: _titles[i],
      _content: _contents[i],
    };
    console.log(t);
    await sheet.addRow(t);
    await driver.sleep(500);
  }
};

const run = async () => {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  await doc.useServiceAccountAuth(gs_cred);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  for (let i = 20; i < menus; i++) {
    await driver.sleep(1000);
    await driver.get(`https://xn--cw0bv1s99jy7m28a.com/${i}`);
    await driver.sleep(1000);

    let l = await driver.findElements(By.className("list-inline"));
    if (l.length === 0) {
      let { _category, _titles, _contents } = await getInfos(driver);
      await insertSheet(sheet, driver, _category, _titles, _contents);

      try {
        let t = await driver.findElements(By.className("pagination"));
        if (t.length > 0) {
          let page = 2;
          let isPage = true;
          while (isPage) {
            await driver.sleep(1000);
            await driver.get(
              `https://xn--cw0bv1s99jy7m28a.com/${i}/page-${page}`
            );
            await driver.sleep(1000);

            let { _category, _titles, _contents } = await getInfos(driver);
            await insertSheet(sheet, driver, _category, _titles, _contents);

            let _t = await driver.findElements(By.className("disabled"));
            if (_t.length >= 3) {
              isPage = false;
              console.log("페이지 끝");
            } else {
              page++;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};

run();
