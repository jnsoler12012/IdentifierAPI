// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export default async function (parameters) {
    const { busStopID } = parameters
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    var url = `
https://mybusnow.njtransit.com/bustime/wireless/html/eta.jsp?route=---&direction=---&displaydirection=---&stop=---&findstop=on&selectedRtpiFeeds=&id=${busStopID}
`;

    try {
        return (async () => {
            console.log('realizaremos peticion')
            puppeteer.use(StealthPlugin())
            // puppeteer usage as normal
            return await puppeteer.launch({ headless: true }).then(async browser => {
                var webpageHTML
                const page = await browser.newPage()
                await page.goto(url)
                await sleep(1000)

                webpageHTML = await page.evaluate(() => document.querySelector('*').outerHTML);

                // console.log('Page Body:', webpageHTML);

                // console.log(page);
                // await page.screenshot({ path: 'testresult.png', fullPage: true }) webpageHTML.body.innerHTML

                await browser.close()
                // console.log(`All done, check the screenshot. ✨`)
                return webpageHTML
            })
        })()
    } catch (error) {
        console.log(error);
        return error
    }
}