import puppeteer from "puppeteer";

const selectFromDropDown = async (page,search,value) => {
  // waiting for search window to open
  await page.waitForSelector('input[placeholder="Search... (Symbol or Address)"]');
  const search_input = await page.$('input[placeholder="Search... (Symbol or Address)"]');
  await search_input.type(search);
  await page.waitForTimeout(4000);

  const tokenOptions = await page.$$('.List div div');
  for(const listItem of tokenOptions){
    const optionValue = await page.evaluate(el => el.querySelector('span').textContent,listItem);
    if(optionValue===value) {
      await listItem.click();
      break;
    }
  }
}
(async () => {
  // Launch a headful browser
  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized']  });

  // Create a new page
  const page = await browser.newPage();
  await page.setViewport({width:1240,height:900})
  // Go to swap.defillama.com
  await page.goto('https://swap.defillama.com');

  // Fill the form
  //chain Input
  const chainInput = await page.$('.css-1wy0on6');
  await chainInput.click();
  const chainInputSelecter = await page.$('#react-select-2-input');
  await chainInputSelecter.type('Arbitrum One');
  await chainInputSelecter.press('Enter');

  // Set Sell Value
  await page.locator('input[value="10"]').fill("12");

  // Token Inputs
  const inputs = await page.$$('.css-q4vstg');
  const sell_button = await inputs[0].$('.chakra-button');
  await sell_button.click();
  await selectFromDropDown(page,'WBTC',"Wrapped BTC (WBTC)");
  const buy_button = await inputs[1].$('.chakra-button');
  await buy_button.click();
  await selectFromDropDown(page,'USDC',"USD Coin (USDC)");
  
  // Wait for the "Select a route" section to appear
  await page.waitForTimeout(8000);
  const selectRoutes = await page.$$('.RouteWrapper');
 
  // Select the second option in the "Select a route" section
  await selectRoutes[1].click();

  // Leave the browser window open
  await new Promise(() => {});
})();
