export const capitalizeEachWord = (str) => {
    const strArr = String(str).split(' ');
    let capStr = "";

    strArr.forEach(str => {
        const capWord = str.charAt(0).toLocaleUpperCase().concat(str.substring(1));

        capStr = capStr.concat(capWord+' ');
    })

    return capStr.trim();
}

export const formatTime = (seconds) => {

    if (!seconds || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
};