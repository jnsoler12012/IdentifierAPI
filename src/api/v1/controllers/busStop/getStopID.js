import { formatterContent } from '../../utils/index.js'

import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____GET BUS ID INITIAL", req.body)

    try {
        const idRequired = req.params?.idBusStop

        const parameters = {
            busStopID: idRequired
        }

        return formatterContent(parameters)
            .then((responseFormatted) => {
                console.log('DEBE ESTAR FORMATEDA PARA MANDAR A HTML', responseFormatted);
                if (!responseFormatted)
                    throw {
                        message: "There are no stop ID",
                        status: 400,
                        path: `BusStop`
                    }
                return res.status(200).json({
                    success: true,
                    message: "List Of stop Id",
                    data: responseFormatted
                })

            })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}