export function getErrosFromAPIres(errorRes) {
    if (errorRes === null || errorRes === undefined
        || errorRes.errorData === null || errorRes.errorData === undefined
        || errorRes.errorData.errorMessage === null || errorRes.errorData.errorMessage === undefined) {
        return[""];
    }
    let errorArr = [];
    let errorMessage = errorRes.errorData.errorMessage;
    Object.values(errorMessage).forEach((value) => {
        errorArr.push(value);
    })
    return errorArr;
}