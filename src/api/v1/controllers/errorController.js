
export default function (error, res) {
    let messageError = {

    };

    const { message, status, path } = error;
    messageError = {
        message, status, path
    }


    return res.status(error.status).json(
        messageError
    )
}