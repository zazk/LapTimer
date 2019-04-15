const puppeteer = require("puppeteer");
require("dotenv").config();
(async () => {
  const DAY = "15/04/2019";
  const TICKET = "Testathon";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://timetracker.bairesdev.com/");

  await page.type(
    "#ctl00_ContentPlaceHolder_UserNameTextBox",
    process.env.TT_USER
  );
  await page.type(
    "#ctl00_ContentPlaceHolder_PasswordTextBox",
    process.env.TT_PASS
  );
  page.click("#ctl00_ContentPlaceHolder_LoginButton");

  await page.waitForNavigation();
  (async (array = Array(9)) => {
    for (const item of array) {
      console.log(item, "log");
      await page.goto(
        "https://timetracker.bairesdev.com/CargaTimeTracker.aspx"
      );
      await page.evaluate(async () => {
        $("#ctl00_ContentPlaceHolder_idProyectoDropDownList")
          .val("508")
          .trigger("change");
        $("#ctl00_ContentPlaceHolder_txtFrom").val(DAY);
        $("#ctl00_ContentPlaceHolder_TiempoTextBox").val("1");

        $("#ctl00_ContentPlaceHolder_DescripcionTextBox").val(
          `${TICKET} ${"\n".repeat(Math.random(5) * 10)}`
        );
      });
      await page.waitFor(1000);
      await page.evaluate(async () => {
        $("#ctl00_ContentPlaceHolder_idTipoAsignacionDropDownList")
          .val("1")
          .trigger("change");
        $("#ctl00_ContentPlaceHolder_idFocalPointClientDropDownList")
          .val("11175")
          .trigger("change");
        $("#ctl00_ContentPlaceHolder_btnAceptar").trigger("click");
      });
      await page.waitForNavigation();
    }
    console.log("Done!");
  })();

  await page.waitFor(30000);
  await browser.close();
})();
