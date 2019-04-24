const puppeteer = require("puppeteer");
require("dotenv").config();
(async () => {
  // WIP Replace these ones by parameters

  const TASKS = Array();
  const DAYS = ["23/04/2019"];
  DAYS.map(day => TASKS.push(...Array(5).fill(day)));
  const TICKET = "AI-801";
  // const TASKS = Array(9).fill(DAY);
  // ====================================

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
  (async (items = Array(9)) => {
    for (const item of items) {
      console.log(item, "log");
      await page.goto(
        "https://timetracker.bairesdev.com/CargaTimeTracker.aspx"
      );
      await page.evaluate(
        async (day, TICKET) => {
          $("#ctl00_ContentPlaceHolder_idProyectoDropDownList")
            .val("508")
            .trigger("change");
          $("#ctl00_ContentPlaceHolder_txtFrom").val(day);
          $("#ctl00_ContentPlaceHolder_TiempoTextBox").val("1");

          $("#ctl00_ContentPlaceHolder_DescripcionTextBox").val(
            `${TICKET} ${"\n".repeat(Math.random(5) * 10)}`
          );
        },
        item,
        TICKET
      );
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
  })(TASKS);

  await page.waitFor(50000);
  await browser.close();
})();
