import { default as petitionGlobalContent } from "./petitionGlobalContent.js"
import * as cheerio from 'cheerio';

export default async function (parameters) {

    return await petitionGlobalContent(parameters).then((response) => {
        // console.log('final repsuesta __________', response)
        const $ = cheerio.load(response);



        var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(response.toString())[1];
        var $bodyElement = $(bodyHtml);

        var currentStopTime = $bodyElement
            .filter('p')
            .filter(
                (i, element) => (
                    ($(element).text().replace(/\s+/g, "").toLowerCase().includes("currently"))
                )
            ).text().trim().replace('Currently:', "").trim()

        var formattedStopBusInfo = $bodyElement.filter('.no-bullets')
            .find('li')
            .toArray()
            .reduce(function (acc, li) {
                const $li = $(li);

                var value = $li.text().trim().split(':');
                acc[value[0].replace(/\s+/g, "").replace('Selected', "")] = value[1].trim();
                return acc;
            }, {});

        var signalNoRoutes = $bodyElement.filter('strong')
            .map(function () {
                return ($(this).text()) ? $(this).text().trim() : null
            })
            .get()[0];

        var formattedStopBusRoutes = $bodyElement.filter('h2')
            .map(function () {
                var $h2 = $(this);
                var textToSelect = $h2.contents()
                    .filter(function () {
                        return this.nodeType === 3;
                    })
                    .map(function () {
                        return $(this).text().trim();
                    })
                    .get()
                    .join(" ")
                    .replace(/\s+/g, " ")
                    .trim();

                var busInfoObj = $h2.find('span')
                    .contents()
                    .filter(function () {
                        return this.nodeType === 3 && $(this).text().trim().length !== 0;
                    })
                    .map(function () {
                        return $(this).text().trim().replace(/\s+/g, " ");
                    })
                    .get()
                    .reduce(function (acc, stringValue) {
                        var arr = stringValue.replace(/[()]/g, '').trim().split(' ');
                        acc[arr[0].replace(/:$/, '')] = arr[1];
                        return acc;
                    }, {});

                var $strong = $h2.find('strong');
                var idBus = $strong.eq(0).text().trim();
                var eta = $strong.eq(1).text().trim();

                return {
                    id: idBus,
                    eta: eta.replace(/\s+/g, "-"),
                    busTextSign: textToSelect,
                    busInfo: busInfoObj
                };
            })
            .get();

        return ({
            busStopTime: currentStopTime,
            busStopInfo: formattedStopBusInfo,
            busStopRoutes: (formattedStopBusRoutes.length <= 0 && signalNoRoutes) ? signalNoRoutes : formattedStopBusRoutes
        })

    })
}
