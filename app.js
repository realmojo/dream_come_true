// const webdriver = require("selenium-webdriver");
// const { By } = require("selenium-webdriver");
// const chrome = require("selenium-webdriver/chrome");
const { Builder, Browser, By, Key, until } = require("selenium-webdriver");

const gs_cred = require("./sheet.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(
  "1HaNcq2TJrbjchZDumxiBuOMD7sG_u_7CFivNP2jDZBI"
);

// const menus = 734;
const menus = 2;
const pages = 100;

const run = async () => {
  // const service = new chrome.ServiceBuilder("./chromedriver").build();
  // console.log(service);
  // chrome.setDefaultService(service);
  // const driver = await new webdriver.Builder().forBrowser("chrome").build(); // await doc.useServiceAccountAuth(gs_cred);

  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  await doc.useServiceAccountAuth(gs_cred);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  for (let i = 1; i < menus; i++) {
    await driver.sleep(1000);
    await driver.get(`https://xn--cw0bv1s99jy7m28a.com/${i}`);
    await driver.sleep(1000);

    let _category = "";
    try {
      _category = await driver
        .findElement(By.className("breadcrumb"))
        .getText();
      _category = _category
        .replace("\n", " / ")
        .replace("\n", " / ")
        .replace("\n", " / ")
        .replace("\n", " / ");
    } catch {
      _category = "-";
    }

    let _titles = [];
    try {
      let t = await driver.findElements(By.className("title"));
      for (const item of t) {
        let d = await item.getText();
        d = d.replace("ㆍ", "");
        _titles.push(d.trim());
      }
    } catch (e) {
      _titles = "-";
    }
    console.log(_titles);

    let _contents = [];
    try {
      let t = await driver.findElements(By.className("content"));
      for (const item of t) {
        let d = await item.getText();
        _contents.push(d.trim());
      }
    } catch (e) {
      _contents = "-";
    }

    console.log(_contents);

    for (let i in _titles) {
      let t = {
        _category,
        _title: _titles[i],
        _content: _contents[i],
      };
      await sheet.addRow(t);
      sleep(500);
    }
  }

  // await doc.loadInfo(); // loads document properties and worksheets
  // const sheet = doc.sheetsByIndex[0];
  // let category = "건강";
  // let title = "좋아요";
  // let content = "매우좋아요";
  // let t = {
  //   _category: category ? category : "-",
  //   _title: title ? title : "-",
  //   _content: content ? content : "-",
  // };
  // console.log(t);
  // await sheet.addRow(t);
};

run();
